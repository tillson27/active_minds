import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import {
  buildInquiryEmail,
  buildAutoReplyEmail,
  buildRetreatRegistrationEmail,
  buildRetreatAutoReplyEmail,
} from './emailTemplate.mjs'

const REGION = process.env.AWS_REGION || 'us-east-1'

const parseList = (s) =>
  (s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

const TO_EMAILS = parseList(process.env.PRACTICE_EMAIL) || []
const RETREAT_EMAILS = parseList(process.env.RETREAT_EMAIL)
const RECIPIENTS = {
  contact: TO_EMAILS.length ? TO_EMAILS : ['info@activemindstherapy.com'],
  retreat: RETREAT_EMAILS.length
    ? RETREAT_EMAILS
    : TO_EMAILS.length
    ? TO_EMAILS
    : ['info@activemindstherapy.com'],
}
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@activeminds.online'
const FROM_NAME = process.env.FROM_NAME || 'ACTive Minds Therapy Website'
const ALLOWED_ORIGINS = parseList(
  process.env.ALLOWED_ORIGINS ||
    'https://activeminds.online,https://www.activeminds.online',
)

const ses = new SESv2Client({ region: REGION })

const corsHeaders = (origin) => {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

const json = (statusCode, body, origin) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  body: JSON.stringify(body),
})

const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

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

export const handler = async (event) => {
  const origin = event?.headers?.origin || event?.headers?.Origin || ''
  const method =
    event?.requestContext?.http?.method || event?.httpMethod || 'POST'

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' }
  }

  if (method !== 'POST') {
    return json(405, { error: 'Method not allowed' }, origin)
  }

  let data
  try {
    data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  } catch {
    return json(400, { error: 'Invalid JSON' }, origin)
  }

  // Honeypot — silently accept if filled, to discourage bots
  if (data?.website || data?.company) {
    return json(200, { ok: true }, origin)
  }

  const formType = data?.formType === 'retreat' ? 'retreat' : 'contact'

  const validationError = validate(data, formType)
  if (validationError) return json(400, { error: validationError }, origin)

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
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: `${FROM_NAME} <${FROM_EMAIL}>`,
        Destination: { ToAddresses: recipients },
        ReplyToAddresses: [payload.email],
        Content: {
          Simple: {
            Subject: { Data: inquirySubject, Charset: 'UTF-8' },
            Body: {
              Html: { Data: inquiry.html, Charset: 'UTF-8' },
              Text: { Data: inquiry.text, Charset: 'UTF-8' },
            },
          },
        },
      }),
    )

    // Fire-and-forget auto-reply
    try {
      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: `ACTive Minds Therapy <${FROM_EMAIL}>`,
          Destination: { ToAddresses: [payload.email] },
          ReplyToAddresses: recipients,
          Content: {
            Simple: {
              Subject: { Data: replySubject, Charset: 'UTF-8' },
              Body: {
                Html: { Data: reply.html, Charset: 'UTF-8' },
                Text: { Data: reply.text, Charset: 'UTF-8' },
              },
            },
          },
        }),
      )
    } catch (autoErr) {
      console.warn('Auto-reply failed (non-fatal):', autoErr?.message)
    }

    return json(200, { ok: true }, origin)
  } catch (err) {
    console.error('SES send failed:', err)
    return json(500, { error: 'Failed to send message' }, origin)
  }
}
