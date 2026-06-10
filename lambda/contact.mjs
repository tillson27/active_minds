import {
  buildInquiryEmail,
  buildAutoReplyEmail,
  buildRetreatRegistrationEmail,
  buildRetreatAutoReplyEmail,
} from './emailTemplate.mjs'
import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const parseList = (s) =>
  (s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

const TO_EMAILS = parseList(process.env.PRACTICE_EMAIL)
const RETREAT_EMAILS = parseList(process.env.RETREAT_EMAIL)
const RECIPIENTS = {
  contact: TO_EMAILS.length ? TO_EMAILS : ['info@activemindstherapy.com'],
  retreat: RETREAT_EMAILS.length
    ? RETREAT_EMAILS
    : TO_EMAILS.length
    ? TO_EMAILS
    : ['info@activemindstherapy.com'],
}
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@activemindstherapy.com'
const FROM_NAME = process.env.FROM_NAME || 'ACTive Minds Therapy Website'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const SUBMISSIONS_TABLE = process.env.SUBMISSIONS_TABLE
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || process.env.RESEND_API_KEY
const ADMIN_SESSION_HOURS = Number(process.env.ADMIN_SESSION_HOURS || '8')

const SUBMISSION_FIELDS = {
  contact: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'service',
    'clinician',
    'message',
  ],
  retreat: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'location',
    'role',
    'organization',
    'dietary',
    'pdFund',
    'notes',
  ],
}

let dynamo

const getDynamo = () => {
  if (!dynamo) {
    const {
      DynamoDBClient,
      PutItemCommand,
      QueryCommand,
    } = require('@aws-sdk/client-dynamodb')
    dynamo = {
      client: new DynamoDBClient({}),
      PutItemCommand,
      QueryCommand,
    }
  }
  return dynamo
}

// The Lambda Function URL is configured with its own CORS, so we do NOT
// add Access-Control-* headers here — duplicating them produces the
// "header contains multiple values" CORS error in browsers.
const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const hashPassword = (password = '') =>
  createHash('sha256').update(String(password)).digest('hex')

const timingSafeEqualString = (a = '', b = '') => {
  const aBuffer = Buffer.from(String(a))
  const bBuffer = Buffer.from(String(b))
  if (aBuffer.length !== bBuffer.length) return false
  return timingSafeEqual(aBuffer, bBuffer)
}

const base64UrlEncode = (value) =>
  Buffer.from(value).toString('base64url')

const base64UrlDecode = (value) =>
  Buffer.from(value, 'base64url').toString('utf8')

const signAdminPayload = (payload) =>
  createHmac('sha256', ADMIN_SESSION_SECRET).update(payload).digest('base64url')

const createAdminToken = () => {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + Math.max(1, ADMIN_SESSION_HOURS || 8) * 60 * 60
  const payload = base64UrlEncode(
    JSON.stringify({
      scope: 'admin',
      iat: now,
      exp,
    }),
  )
  return {
    token: `${payload}.${signAdminPayload(payload)}`,
    expiresAt: new Date(exp * 1000).toISOString(),
  }
}

const verifyAdminToken = (token) => {
  if (!ADMIN_PASSWORD_HASH || !ADMIN_SESSION_SECRET) return false
  const [payload, signature] = String(token || '').split('.')
  if (!payload || !signature) return false
  if (!timingSafeEqualString(signature, signAdminPayload(payload))) return false

  try {
    const claims = JSON.parse(base64UrlDecode(payload))
    return claims.scope === 'admin' && claims.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

const encodeCursor = (key) =>
  key ? base64UrlEncode(JSON.stringify(key)) : null

const decodeCursor = (cursor) => {
  if (!cursor) return undefined
  try {
    return JSON.parse(base64UrlDecode(cursor))
  } catch {
    return undefined
  }
}

const readString = (item, key) => item?.[key]?.S || ''

const serializeSubmission = (item) => {
  const type = readString(item, 'submissionType')
  const fields = SUBMISSION_FIELDS[type] || []
  return {
    submissionType: type,
    submissionId: readString(item, 'submissionId'),
    submittedAt: readString(item, 'submittedAt'),
    ...Object.fromEntries(fields.map((field) => [field, readString(item, field)])),
  }
}

const putString = (item, key, value) => {
  if (value === undefined || value === null || value === '') return
  item[key] = { S: String(value) }
}

const storeSubmission = async (formType, payload) => {
  if (!SUBMISSIONS_TABLE) return

  const submissionId = randomUUID()
  const item = {
    submissionType: { S: formType },
    submittedAtSubmissionId: {
      S: `${payload.submittedAt}#${submissionId}`,
    },
    submissionId: { S: submissionId },
    submittedAt: { S: payload.submittedAt },
    source: { S: 'website' },
  }

  for (const field of SUBMISSION_FIELDS[formType] || []) {
    putString(item, field, payload[field])
  }

  const { client, PutItemCommand } = getDynamo()
  await client.send(
    new PutItemCommand({
      TableName: SUBMISSIONS_TABLE,
      Item: item,
    }),
  )
}

const listSubmissions = async ({ submissionType, cursor, limit }) => {
  if (!SUBMISSIONS_TABLE) {
    throw new Error('Submissions table is not configured')
  }

  const type = submissionType === 'retreat' ? 'retreat' : 'contact'
  const pageSize = Math.max(1, Math.min(Number(limit) || 25, 100))
  const { client, QueryCommand } = getDynamo()
  const response = await client.send(
    new QueryCommand({
      TableName: SUBMISSIONS_TABLE,
      KeyConditionExpression: 'submissionType = :submissionType',
      ExpressionAttributeValues: {
        ':submissionType': { S: type },
      },
      ExclusiveStartKey: decodeCursor(cursor),
      ScanIndexForward: false,
      Limit: pageSize,
    }),
  )

  return {
    submissions: (response.Items || []).map(serializeSubmission),
    nextCursor: encodeCursor(response.LastEvaluatedKey),
  }
}

const REQUIRED_BY_TYPE = {
  contact: ['firstName', 'lastName', 'email', 'service', 'message'],
  retreat: ['firstName', 'lastName', 'email', 'location', 'role'],
}

const validate = (data, formType) => {
  const required = REQUIRED_BY_TYPE[formType] || REQUIRED_BY_TYPE.contact
  for (const k of required) {
    if (!data[k] || typeof data[k] !== 'string' || !data[k].trim()) {
      return `Missing required field: ${k}`
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email address'
  }
  if (data.firstName.length > 100 || data.lastName.length > 100) {
    return 'Name is too long'
  }
  if (data.message && data.message.length > 5000) return 'Message is too long'
  if (data.notes && data.notes.length > 5000) return 'Notes are too long'
  return null
}

const sendEmail = async ({ from, to, replyTo, subject, html, text }) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend ${res.status}: ${body}`)
  }
  return res.json()
}

const handleAdminAction = async (data) => {
  if (!ADMIN_PASSWORD_HASH || !ADMIN_SESSION_SECRET) {
    return json(503, { error: 'Admin access is not configured' })
  }

  if (data.action === 'adminLogin') {
    const candidateHash = hashPassword(data.password || '')
    if (!timingSafeEqualString(candidateHash, ADMIN_PASSWORD_HASH)) {
      return json(401, { error: 'Invalid password' })
    }
    return json(200, { ok: true, ...createAdminToken() })
  }

  if (data.action === 'adminList') {
    if (!verifyAdminToken(data.token)) {
      return json(401, { error: 'Invalid or expired session' })
    }

    try {
      return json(200, {
        ok: true,
        ...(await listSubmissions({
          submissionType: data.submissionType,
          cursor: data.cursor,
          limit: data.limit,
        })),
      })
    } catch (err) {
      console.error('Admin list failed:', err)
      return json(500, { error: 'Failed to load submissions' })
    }
  }

  return json(400, { error: 'Unknown admin action' })
}

export const handler = async (event) => {
  const method =
    event?.requestContext?.http?.method || event?.httpMethod || 'POST'

  // OPTIONS preflight is handled by the Function URL's CORS config; this
  // is a defensive fallback in case the request somehow reaches the function.
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: {}, body: '' }
  }

  if (method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  let data
  try {
    data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  if (String(data?.action || '').startsWith('admin')) {
    return handleAdminAction(data)
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY env var is not set')
    return json(500, { error: 'Email service is not configured' })
  }

  // Honeypot — silently accept if filled, to discourage bots
  if (data?.website || data?.company) {
    return json(200, { ok: true })
  }

  const formType = data?.formType === 'retreat' ? 'retreat' : 'contact'

  const validationError = validate(data, formType)
  if (validationError) return json(400, { error: validationError })

  const basePayload = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || '',
    submittedAt: new Date().toISOString(),
  }

  const payload =
    formType === 'retreat'
      ? {
          ...basePayload,
          location: data.location.trim(),
          role: data.role.trim(),
          organization: data.organization?.trim() || '',
          dietary: data.dietary?.trim() || '',
          pdFund: data.pdFund?.trim() || 'Not applicable',
          notes: data.notes?.trim() || '',
        }
      : {
          ...basePayload,
          service: data.service.trim(),
          clinician: data.clinician?.trim() || '',
          message: data.message.trim(),
        }

  const safe = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, escape(v)]),
  )

  const isRetreat = formType === 'retreat'
  const recipients = RECIPIENTS[formType]
  const inquiry = isRetreat
    ? buildRetreatRegistrationEmail(safe)
    : buildInquiryEmail(safe)
  const reply = isRetreat
    ? buildRetreatAutoReplyEmail(safe)
    : buildAutoReplyEmail(safe)
  const inquirySubject = isRetreat
    ? `Retreat registration: ${payload.firstName} ${payload.lastName} — ${payload.location}`
    : `New inquiry: ${payload.firstName} ${payload.lastName} — ${payload.service}`
  const replySubject = isRetreat
    ? 'Your retreat registration is in — ACTive Minds Therapy'
    : 'We received your message — ACTive Minds Therapy'

  try {
    await sendEmail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipients,
      replyTo: payload.email,
      subject: inquirySubject,
      html: inquiry.html,
      text: inquiry.text,
    })

    // Fire-and-forget auto-reply
    try {
      await sendEmail({
        from: `ACTive Minds Therapy <${FROM_EMAIL}>`,
        to: [payload.email],
        replyTo: recipients[0],
        subject: replySubject,
        html: reply.html,
        text: reply.text,
      })
    } catch (autoErr) {
      console.warn('Auto-reply failed (non-fatal):', autoErr?.message)
    }

    try {
      await storeSubmission(formType, payload)
    } catch (storeErr) {
      console.warn('Submission storage failed (non-fatal):', storeErr?.message)
    }

    return json(200, { ok: true })
  } catch (err) {
    console.error('Resend send failed:', err)
    return json(500, { error: 'Failed to send message' })
  }
}
