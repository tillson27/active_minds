import {
  buildInquiryEmail,
  buildAutoReplyEmail,
  buildRetreatRegistrationEmail,
  buildRetreatAutoReplyEmail,
} from './emailTemplate.mjs'

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

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY env var is not set')
    return json(500, { error: 'Email service is not configured' })
  }

  let data
  try {
    data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
  } catch {
    return json(400, { error: 'Invalid JSON' })
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

    return json(200, { ok: true })
  } catch (err) {
    console.error('Resend send failed:', err)
    return json(500, { error: 'Failed to send message' })
  }
}
