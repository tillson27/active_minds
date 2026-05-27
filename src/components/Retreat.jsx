import { useState } from 'react'
import {
  Leaf,
  Brain,
  HandHeart,
  Compass,
  NotebookPen,
  MapPin,
  CalendarDays,
  DollarSign,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import Reveal from './Reveal'
import triciaImg from '../assets/team/tricia.jpg'
import alisonImg from '../assets/team/alison.jpg'

const HELPS = [
  {
    icon: Leaf,
    text: 'Develop grounding and nervous system regulation strategies',
  },
  {
    icon: Brain,
    text: 'Increase awareness of stress patterns and protective responses',
  },
  {
    icon: HandHeart,
    text: 'Strengthen self-compassion and boundary awareness',
  },
  {
    icon: Compass,
    text: 'Reconnect with your values and professional purpose',
  },
  {
    icon: NotebookPen,
    text: 'Create an individualized wellness plan for the school year',
  },
]

const FACILITATORS = [
  {
    name: 'Tricia Goeldner, MSW, RSW',
    photo: triciaImg,
    bio: 'Social Worker, Educator, and Co-Founder of ACTive Minds Therapy & Consulting with extensive experience supporting individuals, families, and professionals within the school system.',
  },
  {
    name: 'Alison Orford, MSW, RSW',
    photo: alisonImg,
    bio: 'Social Worker, Co-Founder of ACTive Minds Therapy & Consulting with extensive experience supporting wellness, mindfulness, and reflective practice through experiential and nature-based approaches.',
  },
]

const LOGISTICS = [
  {
    icon: CalendarDays,
    title: 'Retreat Dates',
    body: (
      <>
        August 18 — Manitoulin Island
        <br />
        August 20 — Sudbury
      </>
    ),
  },
  {
    icon: MapPin,
    title: 'Locations',
    body: (
      <>
        Manitoulin Island
        <br />
        Sudbury
      </>
    ),
  },
  {
    icon: Users,
    title: 'Limited Registration',
    body: 'Small group sizes for meaningful connection — register early to reserve your spot.',
  },
  {
    icon: DollarSign,
    title: '$200 Registration',
    body: 'Includes retreat materials, workbook, journal, guided activities, lunch, snacks, coffee/tea, and wellness planning resources.',
  },
]

const LOCATION_OPTIONS = [
  'Manitoulin Island',
  'Sudbury',
  'Either location',
]

const ROLE_OPTIONS = [
  'Teacher',
  'Educational Assistant',
  'Early Childhood Educator',
  'School Social Worker',
  'School Psychologist',
  'Guidance Counsellor',
  'Principal / Vice-Principal',
  'Board / District Staff',
  'Other school-based professional',
]

const PD_FUND_OPTIONS = [
  'Not applicable',
  'Yes — please send me the PD Fund request form',
  'I will arrange this on my own',
]

const API_URL =
  import.meta.env.VITE_CONTACT_API_URL ||
  '/api/contact'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  role: '',
  organization: '',
  dietary: '',
  pdFund: 'Not applicable',
  notes: '',
  // Honeypot
  website: '',
}

export default function Retreat() {
  const [form, setForm] = useState(initialForm)
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
        body: JSON.stringify({ ...form, formType: 'retreat' }),
      })
      if (!res.ok) throw new Error('bad response')
      setSubmitted(true)
      window.scrollTo({ top: document.getElementById('register')?.offsetTop - 100 || 0, behavior: 'smooth' })
    } catch {
      setError(
        'We had trouble submitting your registration. Please try again or email us at activemindsalison@gmail.com.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="retreat-page">
      {/* ---------- HERO ---------- */}
      <section className="retreat-hero" id="top">
        <div className="retreat-hero-bg" aria-hidden="true" />
        <div className="retreat-hero-inner container">
          <Reveal className="retreat-hero-copy">
            <span className="eyebrow">Wellness Retreat for School Professionals</span>
            <h1 className="retreat-hero-title">
              Preparing for the School Year with{' '}
              <em>Compassion, Clarity, and Sustainability</em>
            </h1>
            <div className="retreat-hero-divider" aria-hidden="true">
              <Leaf size={18} />
            </div>
            <p className="retreat-hero-lead">
              A full-day experiential retreat to help you reconnect with
              wellbeing, passion, and purpose.
            </p>
            <div className="retreat-hero-actions">
              <a href="#register" className="btn btn-primary">
                Register Now <ArrowRight className="arrow" size={18} />
              </a>
              <a href="#details" className="btn btn-secondary">
                See what&rsquo;s included
              </a>
            </div>
          </Reveal>
        </div>

        <div className="retreat-hero-banner">
          <div className="container">
            <div className="retreat-hero-banner-inner">
              <Leaf size={20} aria-hidden="true" />
              <div>
                <strong>You care for so many. This day is for you.</strong>
                <span>Practical tools. Deep reflection. Meaningful connection.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HELPS + FACILITATORS ---------- */}
      <section className="retreat-helps" id="details">
        <div className="container">
          <div className="retreat-helps-grid">
            <Reveal className="retreat-helps-col">
              <h2 className="retreat-section-eyebrow">This retreat will help you</h2>
              <ul className="retreat-helps-list">
                {HELPS.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span className="retreat-helps-icon">
                      <Icon size={20} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="retreat-expect">
                <h3>What to Expect</h3>
                <p>
                  An interactive, reflective, and experiential day that includes
                  guided discussions, nature-based mindfulness, and practical
                  wellness tools you can use right away &mdash; at school and at
                  home.
                </p>
                <p className="retreat-expect-tag">
                  <em>Nature. Reflection. Renewal.</em>
                  <br />
                  <em>You don&rsquo;t have to do it all alone.</em>
                </p>
              </div>
            </Reveal>

            <Reveal className="retreat-helps-col" delay={120}>
              <h2 className="retreat-section-eyebrow">Facilitated by</h2>
              <div className="retreat-facilitators">
                {FACILITATORS.map((f) => (
                  <div className="retreat-facilitator" key={f.name}>
                    <div className="retreat-facilitator-photo">
                      <img src={f.photo} alt={`Portrait of ${f.name}`} loading="lazy" />
                    </div>
                    <div className="retreat-facilitator-body">
                      <h4>{f.name}</h4>
                      <p>{f.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- LOGISTICS ---------- */}
      <section className="retreat-logistics">
        <div className="container">
          <Reveal className="retreat-logistics-card">
            <h2 className="retreat-section-eyebrow center">Retreat Details</h2>
            <div className="retreat-logistics-grid">
              {LOGISTICS.map(({ icon: Icon, title, body, note }) => (
                <div className="retreat-logistic" key={title}>
                  <div className="retreat-logistic-icon">
                    <Icon size={20} />
                  </div>
                  <div className="retreat-logistic-body">
                    <h4>{title}</h4>
                    <p>{body}</p>
                    {note && <p className="retreat-logistic-note">{note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="retreat-pd-row">
              <div className="retreat-pd-icon">
                <Users size={20} />
              </div>
              <p>
                Participants may be eligible for PD funding support through
                their local.
              </p>
            </div>
          </Reveal>

          <Reveal className="retreat-osstf" delay={100}>
            <div className="retreat-osstf-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <h4>For OSSTF Members</h4>
              <p>
                You may be eligible to apply to your Local Professional
                Development (PD) Fund to help cover the cost of this workshop.
                Ask us for a PD Fund request form.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- REGISTRATION FORM ---------- */}
      <section className="retreat-register" id="register">
        <div className="container">
          <div className="retreat-register-grid">
            <Reveal className="retreat-register-info">
              <span className="eyebrow">Reserve your spot</span>
              <h2 className="section-title">
                Invest in <em>you</em>. It changes everything.
              </h2>
              <p>
                As burnout and emotional strain continue to rise across school
                communities, proactive wellness initiatives like this are
                essential in supporting healthy, sustainable learning
                environments.
              </p>

              <ul className="retreat-register-list">
                <li>
                  <Heart size={16} /> Full-day retreat &mdash; $200 per participant
                </li>
                <li>
                  <Heart size={16} /> Limited registration — small group sizes for genuine connection
                </li>
                <li>
                  <Heart size={16} /> Materials, journal, lunch &amp; refreshments included
                </li>
                <li>
                  <Heart size={16} /> Receipt provided for PD/wellness reimbursement
                </li>
              </ul>

              <p className="retreat-register-contact">
                Questions? Email us at{' '}
                <a href="mailto:activemindsalison@gmail.com">
                  activemindsalison@gmail.com
                </a>
                .
              </p>
            </Reveal>

            <Reveal className="contact-form retreat-form" delay={120}>
              {submitted ? (
                <div className="form-success">
                  <div className="form-success-icon">
                    <CheckCircle size={28} />
                  </div>
                  <h3>Your registration is in!</h3>
                  <p>
                    Thank you for reserving your spot at the Wellness Retreat
                    for School Professionals. We&rsquo;ll be in touch within
                    one business day with payment details and a confirmation
                    package. If you indicated you&rsquo;d like a PD Fund
                    request form, we&rsquo;ll include that as well.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="form-eyebrow">Registration Form</div>
                  <h3>Reserve your spot</h3>
                  <p>
                    Fill in your details below and we&rsquo;ll follow up with
                    payment and confirmation details.
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
                      <label htmlFor="location">Preferred location</label>
                      <select
                        id="location"
                        name="location"
                        required
                        value={form.location}
                        onChange={onChange}
                      >
                        <option value="" disabled>Select a location…</option>
                        {LOCATION_OPTIONS.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <select
                        id="role"
                        name="role"
                        required
                        value={form.role}
                        onChange={onChange}
                      >
                        <option value="" disabled>Select your role…</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="organization">
                      School / Board / Organization <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      value={form.organization}
                      onChange={onChange}
                      placeholder="e.g. Rainbow District School Board"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pdFund">OSSTF / PD Fund request form</label>
                    <select
                      id="pdFund"
                      name="pdFund"
                      value={form.pdFund}
                      onChange={onChange}
                    >
                      {PD_FUND_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dietary">
                      Dietary restrictions or accessibility needs <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="dietary"
                      name="dietary"
                      type="text"
                      value={form.dietary}
                      onChange={onChange}
                      placeholder="e.g. vegetarian, gluten-free, mobility considerations"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">
                      Anything else you&rsquo;d like us to know? <span className="opt">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={form.notes}
                      onChange={onChange}
                      placeholder="Questions, accommodations, or notes for the facilitators…"
                    />
                  </div>

                  {/* Honeypot */}
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
                    By submitting, you&rsquo;re reserving a spot subject to
                    confirmation and payment. We never share your information.
                  </p>

                  {error && <div className="form-error">{error}</div>}

                  <button
                    type="submit"
                    className="btn btn-primary form-submit"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <Loader2 size={18} className="spin" /> Submitting…
                      </>
                    ) : (
                      <>
                        Submit registration <ArrowRight className="arrow" size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
