import { useState } from 'react'
import {
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Loader2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import Reveal from './Reveal'

const SERVICE_OPTIONS = [
  'Individual Therapy',
  'Couples Therapy',
  'Family Therapy',
  'Clinical Supervision',
  'Training',
  'Consulting',
  'Living & Moving with Grief Program',
  'MBCT Program',
  'General Inquiry',
]

const PREFERRED_CLINICIAN = [
  'No preference',
  'Alison Orford',
  'Christine McInnes',
  'Tricia Goeldner',
]

const API_URL =
  import.meta.env.VITE_CONTACT_API_URL ||
  '/api/contact'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  clinician: 'No preference',
  message: '',
  // Honeypot — never displayed to real users; bots fill it, server discards.
  website: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('bad response')
      setSubmitted(true)
    } catch {
      setError(
        'We had trouble sending your message. Please try again or reach us directly at (705) 207-5300.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-grid">
          <Reveal className="contact-info">
            <span className="eyebrow">Get in Touch</span>
            <h2 className="section-title">
              Take the first step <em>when you&rsquo;re ready</em>.
            </h2>
            <p>
              Reach out for a free 15-minute consultation, ask about a program,
              or simply say hello. We&rsquo;ll get back to you with care.
            </p>

            <div className="contact-details">
              <div className="contact-row">
                <div className="contact-row-icon"><Phone size={18} /></div>
                <div className="contact-row-body">
                  <div className="key">Phone</div>
                  <div className="val">
                    <a href="tel:+17052075300">(705) 207-5300</a>
                  </div>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-row-icon"><MapPin size={18} /></div>
                <div className="contact-row-body">
                  <div className="key">Where We Practice</div>
                  <div className="val">
                    Sudbury &amp; Manitoulin, Ontario
                    <br />
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontWeight: 400 }}>
                      510 Perivale Rd E, Spring Bay · Virtual sessions province-wide
                    </span>
                  </div>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-row-icon"><Calendar size={18} /></div>
                <div className="contact-row-body">
                  <div className="key">Coverage</div>
                  <div className="val" style={{ fontWeight: 400, fontSize: '0.95rem' }}>
                    Sessions are typically covered by most extended health
                    benefit plans. Receipts provided for reimbursement.
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-cta">
              <h4>Already know who you&rsquo;d like to see?</h4>
              <p>
                Book directly with any of our clinicians through our secure
                online scheduler. It&rsquo;s the fastest way to lock in a time.
              </p>
              <a
                href="https://activemindstherapyconsulting.janeapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-block"
              >
                Book on Jane App <ExternalLink size={16} />
              </a>
            </div>
          </Reveal>

          <Reveal className="contact-form" delay={120}>
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <CheckCircle size={28} />
                </div>
                <h3>Your message is on its way</h3>
                <p>
                  Thank you for reaching out. One of our team will be in touch
                  within one business day. If your matter is urgent, please call
                  us at <strong>(705) 207-5300</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="form-eyebrow">Send us a message</div>
                <h3>We&rsquo;d love to hear from you</h3>
                <p>
                  Tell us a little about what brings you here. Everything you
                  share is kept confidential.
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={form.firstName}
                      onChange={onChange}
                      placeholder="Jane"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={form.lastName}
                      onChange={onChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="(705) 555-0123"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="service">Service of interest</label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={form.service}
                      onChange={onChange}
                    >
                      <option value="" disabled>Select a service…</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="clinician">Preferred clinician</label>
                    <select
                      id="clinician"
                      name="clinician"
                      value={form.clinician}
                      onChange={onChange}
                    >
                      {PREFERRED_CLINICIAN.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    placeholder="Tell us a little about what you're looking for…"
                  />
                </div>

                {/* Honeypot field — hidden from sighted users & assistive tech. */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                  }}
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={onChange}
                  />
                </div>

                <p className="form-consent">
                  By submitting, you consent to us contacting you about your
                  inquiry. We never share your information.
                </p>

                {error && <div className="form-error">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-primary form-submit"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 size={18} className="spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <ArrowRight className="arrow" size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
