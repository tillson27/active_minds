/**
 * Two beautifully designed transactional email templates:
 *  1. buildInquiryEmail — goes to the practice (rich detail card)
 *  2. buildAutoReplyEmail — goes to the sender (warm acknowledgement)
 *
 * Both use bullet-proof, table-based HTML so they render reliably across
 * Gmail, Outlook, Apple Mail, and mobile clients. Inputs are expected to be
 * pre-escaped by the handler.
 */

const COLORS = {
  sage: '#324a42',
  sageLight: '#4f7359',
  sagePale: '#e3ece4',
  sageBg: '#f3f6f3',
  bone: '#fbf9f4',
  ink: '#1f2a25',
  inkSoft: '#3a463f',
  inkMuted: '#6c7972',
  inkFaint: '#97a39d',
  border: '#dce3dd',
  accent: '#b87752',
}

const wrap = ({ title, preheader, content }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bone};font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:${COLORS.ink};">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bone};padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;border:1px solid ${COLORS.border};overflow:hidden;box-shadow:0 1px 2px rgba(24,37,33,0.04),0 12px 32px rgba(24,37,33,0.05);">
        ${content}
      </table>
      <p style="font-size:11px;color:${COLORS.inkFaint};margin:18px 0 0;line-height:1.5;letter-spacing:0.02em;">
        ACTive Minds Therapy &amp; Consulting &middot; Sudbury &amp; Manitoulin, Ontario
      </p>
    </td></tr>
  </table>
</body>
</html>`

const brandHeader = ({ subtitle }) => `
<tr>
  <td style="background:linear-gradient(135deg,${COLORS.sage} 0%,${COLORS.sageLight} 100%);padding:36px 40px 32px;color:#ffffff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;padding-right:14px;">
                <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.15);display:inline-block;text-align:center;line-height:44px;font-size:22px;">&#127807;</div>
              </td>
              <td style="vertical-align:middle;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;letter-spacing:-0.01em;color:#ffffff;line-height:1.1;">
                  <strong style="font-weight:600;">ACT</strong>ive Minds
                </div>
                <div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.sagePale};margin-top:4px;">
                  Therapy &amp; Consulting
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" style="vertical-align:middle;">
          <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.7);">${subtitle}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>`

const brandFooter = (cta = '') => `
<tr>
  <td style="background:${COLORS.sageBg};padding:24px 40px;text-align:center;border-top:1px solid ${COLORS.border};">
    ${cta}
    <p style="margin:0;font-size:13px;color:${COLORS.inkSoft};font-weight:500;line-height:1.5;">
      ACTive Minds Therapy &amp; Consulting
    </p>
    <p style="margin:4px 0 0;font-size:12px;color:${COLORS.inkMuted};line-height:1.5;">
      (705) 207-5300 &middot; Sudbury &amp; Manitoulin, Ontario
    </p>
  </td>
</tr>`

export function buildInquiryEmail(d) {
  const html = wrap({
    title: 'New contact form submission',
    preheader: `${d.firstName} ${d.lastName} just reached out about ${d.service}.`,
    content: `
${brandHeader({ subtitle: 'New Inquiry' })}

<tr>
  <td style="padding:36px 40px 8px;">
    <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:500;color:${COLORS.sage};letter-spacing:-0.01em;line-height:1.25;">
      You have a new inquiry from ${d.firstName} ${d.lastName}.
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:${COLORS.inkMuted};line-height:1.6;">
      Submitted ${formatDate(d.submittedAt)}.
    </p>

    <!-- Quick reply button -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td>
          <a href="mailto:${d.email}?subject=Re%3A%20Your%20inquiry%20to%20ACTive%20Minds%20Therapy"
             style="display:inline-block;background:${COLORS.sage};color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:11px 22px;border-radius:999px;letter-spacing:0.01em;">
            Reply to ${d.firstName}
          </a>
        </td>
        <td style="padding-left:10px;">
          <a href="tel:${d.phone.replace(/[^0-9+]/g, '')}"
             style="display:${d.phone ? 'inline-block' : 'none'};background:transparent;color:${COLORS.sage};font-size:14px;font-weight:500;text-decoration:none;padding:10px 22px;border-radius:999px;letter-spacing:0.01em;border:1.5px solid ${COLORS.sage};">
            Call ${d.phone}
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- Detail card -->
<tr>
  <td style="padding:0 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.sageBg};border-radius:14px;">
      <tr>
        <td style="padding:24px 28px;">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:${COLORS.sageLight};margin-bottom:14px;">
            Contact Details
          </div>
          ${row('Name', `${d.firstName} ${d.lastName}`)}
          ${row('Email', `<a href="mailto:${d.email}" style="color:${COLORS.sage};text-decoration:none;font-weight:500;">${d.email}</a>`)}
          ${d.phone ? row('Phone', `<a href="tel:${d.phone}" style="color:${COLORS.sage};text-decoration:none;">${d.phone}</a>`) : ''}
          ${row('Service', pill(d.service))}
          ${d.clinician && d.clinician !== 'No preference' ? row('Clinician', pill(d.clinician, COLORS.accent)) : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- Message -->
<tr>
  <td style="padding:28px 40px 8px;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:${COLORS.sageLight};margin-bottom:10px;">
      Their Message
    </div>
    <div style="background:${COLORS.bone};border-left:3px solid ${COLORS.sageLight};border-radius:0 12px 12px 0;padding:20px 22px;">
      <p style="margin:0;font-size:15px;line-height:1.75;color:${COLORS.ink};white-space:pre-line;">${d.message.replace(/\n/g, '<br>')}</p>
    </div>
  </td>
</tr>

<tr>
  <td style="padding:24px 40px 32px;">
    <p style="margin:0;font-size:13px;color:${COLORS.inkMuted};line-height:1.6;">
      Tip: replying to this email goes directly to ${d.firstName}.
    </p>
  </td>
</tr>

${brandFooter()}
`,
  })

  const text = [
    'New inquiry from the ACTive Minds Therapy website',
    '',
    `Name:     ${d.firstName} ${d.lastName}`,
    `Email:    ${d.email}`,
    d.phone ? `Phone:    ${d.phone}` : null,
    `Service:  ${d.service}`,
    d.clinician && d.clinician !== 'No preference' ? `Clinician: ${d.clinician}` : null,
    '',
    'Message:',
    d.message,
    '',
    `Submitted ${formatDate(d.submittedAt)}`,
  ]
    .filter(Boolean)
    .join('\n')

  return { html, text }
}

export function buildAutoReplyEmail(d) {
  const html = wrap({
    title: 'We received your message',
    preheader: 'Thanks for reaching out — here is what to expect next.',
    content: `
${brandHeader({ subtitle: 'Confirmation' })}

<tr>
  <td style="padding:40px 40px 8px;">
    <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:500;color:${COLORS.sage};letter-spacing:-0.01em;line-height:1.2;">
      Hi ${d.firstName}, your message is with us.
    </h1>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${COLORS.inkSoft};font-weight:400;">
      Thank you for reaching out to ACTive Minds Therapy &amp; Consulting. We&rsquo;ve received your inquiry and one of our team will be in touch within <strong>one business day</strong>.
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:${COLORS.inkSoft};font-weight:400;">
      If your matter is more urgent, you can reach us by phone at <a href="tel:+17052075300" style="color:${COLORS.sage};font-weight:500;text-decoration:none;">(705) 207-5300</a>, or book a free 15-minute consultation directly through our online scheduler.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <a href="https://activemindstherapyconsulting.janeapp.com/"
             style="display:inline-block;background:${COLORS.sage};color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:13px 26px;border-radius:999px;letter-spacing:0.01em;">
            Book a Free Consultation
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>

<tr>
  <td style="padding:24px 40px 8px;">
    <div style="background:${COLORS.sageBg};border-radius:14px;padding:22px 26px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:${COLORS.sageLight};margin-bottom:10px;">
        A note from us
      </div>
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;line-height:1.65;color:${COLORS.sage};font-weight:400;">
        &ldquo;Hope is being able to see that there is light despite all of the darkness.&rdquo; <span style="font-style:normal;font-family:-apple-system,Arial,sans-serif;font-size:12px;color:${COLORS.inkMuted};letter-spacing:0.08em;">— DESMOND TUTU</span>
      </p>
    </div>
  </td>
</tr>

<tr>
  <td style="padding:20px 40px 8px;">
    <p style="margin:0 0 6px;font-size:13px;color:${COLORS.inkMuted};line-height:1.6;">
      For your reference, here&rsquo;s a copy of what you sent us:
    </p>
    <div style="background:${COLORS.bone};border:1px solid ${COLORS.border};border-radius:12px;padding:18px 20px;margin-top:8px;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.inkMuted};font-weight:600;">
        ${d.service}${d.clinician && d.clinician !== 'No preference' ? ` &middot; ${d.clinician}` : ''}
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${COLORS.inkSoft};white-space:pre-line;">${d.message.replace(/\n/g, '<br>')}</p>
    </div>
  </td>
</tr>

<tr>
  <td style="padding:24px 40px 32px;">
    <p style="margin:0;font-size:13px;color:${COLORS.inkMuted};line-height:1.6;">
      With care,<br/>
      <strong style="color:${COLORS.inkSoft};">The ACTive Minds Therapy Team</strong>
    </p>
  </td>
</tr>

${brandFooter()}
`,
  })

  const text = `Hi ${d.firstName},

Thank you for reaching out to ACTive Minds Therapy & Consulting. We've received your message and one of our team will be in touch within one business day.

If your matter is more urgent, you can call us at (705) 207-5300, or book a free 15-minute consultation here:
https://activemindstherapyconsulting.janeapp.com/

For your reference, here's a copy of what you sent:

${d.service}${d.clinician && d.clinician !== 'No preference' ? ` (${d.clinician})` : ''}
${d.message}

With care,
The ACTive Minds Therapy Team

(705) 207-5300 · Sudbury & Manitoulin, Ontario`

  return { html, text }
}

export function buildRetreatRegistrationEmail(d) {
  const html = wrap({
    title: 'New retreat registration',
    preheader: `${d.firstName} ${d.lastName} has registered for the Wellness Retreat (${d.location}).`,
    content: `
${brandHeader({ subtitle: 'Retreat Registration' })}

<tr>
  <td style="padding:36px 40px 8px;">
    <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:500;color:${COLORS.sage};letter-spacing:-0.01em;line-height:1.25;">
      ${d.firstName} ${d.lastName} just registered for the retreat.
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:${COLORS.inkMuted};line-height:1.6;">
      Submitted ${formatDate(d.submittedAt)}.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td>
          <a href="mailto:${d.email}?subject=Re%3A%20Wellness%20Retreat%20Registration"
             style="display:inline-block;background:${COLORS.sage};color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:11px 22px;border-radius:999px;letter-spacing:0.01em;">
            Reply to ${d.firstName}
          </a>
        </td>
        <td style="padding-left:10px;">
          <a href="tel:${d.phone.replace(/[^0-9+]/g, '')}"
             style="display:${d.phone ? 'inline-block' : 'none'};background:transparent;color:${COLORS.sage};font-size:14px;font-weight:500;text-decoration:none;padding:10px 22px;border-radius:999px;letter-spacing:0.01em;border:1.5px solid ${COLORS.sage};">
            Call ${d.phone}
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>

<tr>
  <td style="padding:0 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.sageBg};border-radius:14px;">
      <tr>
        <td style="padding:24px 28px;">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:${COLORS.sageLight};margin-bottom:14px;">
            Registrant Details
          </div>
          ${row('Name', `${d.firstName} ${d.lastName}`)}
          ${row('Email', `<a href="mailto:${d.email}" style="color:${COLORS.sage};text-decoration:none;font-weight:500;">${d.email}</a>`)}
          ${d.phone ? row('Phone', `<a href="tel:${d.phone}" style="color:${COLORS.sage};text-decoration:none;">${d.phone}</a>`) : ''}
          ${row('Location', pill(d.location))}
          ${row('Role', pill(d.role, COLORS.accent))}
          ${d.organization ? row('Org.', d.organization) : ''}
          ${d.pdFund && d.pdFund !== 'Not applicable' ? row('PD Fund', d.pdFund) : ''}
          ${d.dietary ? row('Dietary', d.dietary) : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>

${
  d.notes
    ? `
<tr>
  <td style="padding:28px 40px 8px;">
    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:${COLORS.sageLight};margin-bottom:10px;">
      Their Notes
    </div>
    <div style="background:${COLORS.bone};border-left:3px solid ${COLORS.sageLight};border-radius:0 12px 12px 0;padding:20px 22px;">
      <p style="margin:0;font-size:15px;line-height:1.75;color:${COLORS.ink};white-space:pre-line;">${d.notes.replace(/\n/g, '<br>')}</p>
    </div>
  </td>
</tr>`
    : ''
}

<tr>
  <td style="padding:24px 40px 32px;">
    <p style="margin:0;font-size:13px;color:${COLORS.inkMuted};line-height:1.6;">
      Tip: replying to this email goes directly to ${d.firstName}.
    </p>
  </td>
</tr>

${brandFooter()}
`,
  })

  const text = [
    'New retreat registration from the ACTive Minds Therapy website',
    '',
    `Name:        ${d.firstName} ${d.lastName}`,
    `Email:       ${d.email}`,
    d.phone ? `Phone:       ${d.phone}` : null,
    `Location:    ${d.location}`,
    `Role:        ${d.role}`,
    d.organization ? `Org:         ${d.organization}` : null,
    d.pdFund && d.pdFund !== 'Not applicable' ? `PD Fund:     ${d.pdFund}` : null,
    d.dietary ? `Dietary:     ${d.dietary}` : null,
    '',
    d.notes ? 'Notes:' : null,
    d.notes || null,
    d.notes ? '' : null,
    `Submitted ${formatDate(d.submittedAt)}`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return { html, text }
}

export function buildRetreatAutoReplyEmail(d) {
  const wantsPdForm = (d.pdFund || '').toLowerCase().includes('please send')

  const html = wrap({
    title: 'Your retreat registration is in',
    preheader: 'Thanks for registering — here is what to expect next.',
    content: `
${brandHeader({ subtitle: 'Retreat Confirmation' })}

<tr>
  <td style="padding:40px 40px 8px;">
    <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:500;color:${COLORS.sage};letter-spacing:-0.01em;line-height:1.2;">
      Hi ${d.firstName}, your spot is reserved.
    </h1>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${COLORS.inkSoft};font-weight:400;">
      Thank you for registering for <strong>Preparing for the School Year with Compassion, Clarity, and Sustainability</strong> &mdash; our full-day wellness retreat for school professionals.
    </p>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${COLORS.inkSoft};font-weight:400;">
      We&rsquo;ll follow up within <strong>one business day</strong> with payment details, location specifics, and what to bring. ${
        wantsPdForm
          ? 'We&rsquo;ll also include a PD Fund request form you can submit to your OSSTF local.'
          : ''
      }
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:${COLORS.inkSoft};font-weight:400;">
      If anything changes or you have a question in the meantime, just reply to this email.
    </p>
  </td>
</tr>

<tr>
  <td style="padding:0 40px 8px;">
    <div style="background:${COLORS.sageBg};border-radius:14px;padding:22px 26px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:${COLORS.sageLight};margin-bottom:12px;">
        Your registration
      </div>
      ${row('Location', pill(d.location))}
      ${row('Role', pill(d.role, COLORS.accent))}
      ${d.organization ? row('Org.', d.organization) : ''}
      ${d.dietary ? row('Dietary', d.dietary) : ''}
      ${d.pdFund && d.pdFund !== 'Not applicable' ? row('PD Fund', d.pdFund) : ''}
    </div>
  </td>
</tr>

<tr>
  <td style="padding:24px 40px 8px;">
    <div style="background:${COLORS.bone};border:1px solid ${COLORS.border};border-radius:12px;padding:20px 22px;">
      <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:${COLORS.sage};line-height:1.5;">
        You care for so many. This day is for you.
      </p>
      <p style="margin:0;font-size:13px;color:${COLORS.inkMuted};line-height:1.6;">
        Practical tools. Deep reflection. Meaningful connection.
      </p>
    </div>
  </td>
</tr>

<tr>
  <td style="padding:24px 40px 32px;">
    <p style="margin:0;font-size:13px;color:${COLORS.inkMuted};line-height:1.6;">
      With care,<br/>
      <strong style="color:${COLORS.inkSoft};">Tricia Goeldner &amp; Alison Orford</strong><br/>
      ACTive Minds Therapy &amp; Consulting
    </p>
  </td>
</tr>

${brandFooter()}
`,
  })

  const text = `Hi ${d.firstName},

Thank you for registering for "Preparing for the School Year with Compassion, Clarity, and Sustainability" — our full-day wellness retreat for school professionals.

We'll follow up within one business day with payment details, location specifics, and what to bring.${
    wantsPdForm
      ? " We'll also include a PD Fund request form you can submit to your OSSTF local."
      : ''
  }

Your registration:
- Location:  ${d.location}
- Role:      ${d.role}${d.organization ? `\n- Org:       ${d.organization}` : ''}${d.dietary ? `\n- Dietary:   ${d.dietary}` : ''}${d.pdFund && d.pdFund !== 'Not applicable' ? `\n- PD Fund:   ${d.pdFund}` : ''}

"You care for so many. This day is for you."
Practical tools. Deep reflection. Meaningful connection.

With care,
Tricia Goeldner & Alison Orford
ACTive Minds Therapy & Consulting`

  return { html, text }
}

function row(key, value) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:${COLORS.inkMuted};width:90px;vertical-align:top;letter-spacing:0.02em;">${key}</td>
        <td style="padding:6px 0;font-size:14px;color:${COLORS.ink};vertical-align:top;line-height:1.55;">${value}</td>
      </tr>
    </table>`
}

function pill(label, color = COLORS.sage) {
  return `<span style="display:inline-block;background:${COLORS.sagePale};color:${color};font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px;letter-spacing:0.02em;">${label}</span>`
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-CA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Toronto',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}
