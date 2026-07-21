import { useState } from 'react'
import {
  HandHeart,
  Heart,
  Users,
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  Leaf,
  ArrowRight,
  CheckCircle,
  Loader2,
  Waves,
} from 'lucide-react'
import Reveal from './Reveal'
import christineImg from '../assets/team/christine.jpg'

const EXPECT = [
  {
    icon: HandHeart,
    text: 'A safe, non-judgmental space to share exactly as you are',
  },
  {
    icon: Users,
    text: 'Guided discussions and genuine connection with others who are grieving',
  },
  {
    icon: Heart,
    text: 'Emotional support grounded in evidence-based grief therapy',
  },
  {
    icon: Waves,
    text: 'Learn how your body responds to grief and gentle movements to ease physical stress',
  },
  {
    icon: Leaf,
    text: 'No yoga experience necessary — come exactly as you are',
  },
]

const FACILITATORS = [
  {
    name: 'Christine McInnes, MSW, RSW',
    role: 'Co-Facilitator — Living with Grief',
    org: 'Certified Grief Therapist · ACTive Minds Therapy',
    photo: christineImg,
    bio: 'Certified Grief Therapist and Social Worker with ACTive Minds Therapy & Consulting. Christine brings deep experience holding space for the complexity of loss and helping clients live meaningfully alongside their grief.',
  },
  {
    name: 'Dawn Condon',
    role: 'Co-Facilitator — Moving with Grief',
    org: 'Certified Yoga Therapist · Connected Living Yoga & Wellness',
    photo: null,
    bio: 'Certified Yoga Therapist with Connected Living Yoga & Wellness. Dawn guides mindful, accessible movement that meets the body where it is — no yoga experience required.',
  },
]

const LOGISTICS = [
  {
    icon: CalendarDays,
    title: 'Dates',
    body: (
      <>
        6-week series
        <br />
        Oct 20 – Nov 26, 2026
      </>
    ),
  },
  {
    icon: Clock,
    title: 'Time',
    body: (
      <>
        Tuesdays
        <br />
        6:30pm – 8:00pm
      </>
    ),
  },
  {
    icon: MapPin,
    title: 'Location',
    body: (
      <>
        St Peter&rsquo;s United Church
        <br />
        York St, Sudbury
      </>
    ),
  },
  {
    icon: DollarSign,
    title: '$425 + HST',
    body: 'Per person for the full 6-week series. May be covered by your insurance / benefits package.',
  },
]

const API_URL =
  import.meta.env.VITE_CONTACT_API_URL ||
  '/api/contact'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  attendees: '1',
  yogaExperience: 'No — this will be my first time',
  benefitsCoverage: 'Not sure yet',
  accessibility: '',
  notes: '',
  // Honeypot
  website: '',
}

const YOGA_OPTIONS = [
  'No — this will be my first time',
  'A little — I have tried yoga a few times',
  'Yes — I practice regularly',
]

const BENEFITS_OPTIONS = [
  'Not sure yet',
  'Yes — I will submit through insurance / benefits',
  'No — I will cover it personally',
]

export default function GriefProgram() {
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
        body: JSON.stringify({ ...form, formType: 'grief' }),
      })
      if (!res.ok) throw new Error('bad response')
      setSubmitted(true)
      window.scrollTo({
        top: (document.getElementById('register')?.offsetTop || 0) - 100,
        behavior: 'smooth',
      })
    } catch {
      setError(
        'We had trouble submitting your registration. Please try again or email Christine directly at cmcinnes4@gmail.com.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="retreat-page grief-page">
      {/* ---------- HERO ---------- */}
      <section className="retreat-hero grief-hero" id="top">
        <div className="retreat-hero-bg grief-hero-bg" aria-hidden="true" />
        <div className="retreat-hero-inner container">
          <Reveal className="retreat-hero-copy">
            <span className="eyebrow">6-Week Grief Program · Fall 2026 Cohort</span>
            <h1 className="retreat-hero-title">
              Living <em>&amp;</em> Moving with <em>Grief</em>
            </h1>
            <div className="retreat-hero-divider grief-hero-divider" aria-hidden="true">
              <HandHeart size={18} />
            </div>
            <p className="retreat-hero-lead">
              A combined grief therapy and gentle yoga experience. Explore how
              to live and move through your grief journey — with support, without
              judgement, and without expectations.
            </p>
            <div className="retreat-hero-actions">
              <a href="#register" className="btn btn-primary">
                Register Now <ArrowRight className="arrow" size={18} />
              </a>
              <a href="#details" className="btn btn-secondary">
                See what to expect
              </a>
            </div>
          </Reveal>
        </div>

        <div className="retreat-hero-banner grief-hero-banner">
          <div className="container">
            <div className="retreat-hero-banner-inner">
              <HandHeart size={20} aria-hidden="true" />
              <div>
                <strong>All are welcome. No judgement. No expectations.</strong>
                <span>Come exactly as you are.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHAT TO EXPECT + FACILITATORS ---------- */}
      <section className="retreat-helps" id="details">
        <div className="container">
          <div className="retreat-helps-grid">
            <Reveal className="retreat-helps-col">
              <h2 className="retreat-section-eyebrow">What to expect</h2>
              <ul className="retreat-helps-list">
                {EXPECT.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span className="retreat-helps-icon">
                      <Icon size={20} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="retreat-expect">
                <h3>How the series works</h3>
                <p>
                  Each session weaves together grief therapy and gentle,
                  trauma-informed yoga. Christine holds space for reflection,
                  guided discussion, and emotional support — then Dawn leads
                  mindful movements designed to help your body process and
                  soften around the physical weight of grief.
                </p>
                <p className="retreat-expect-tag">
                  <em>Explore how to live and move through your grief journey.</em>
                </p>
              </div>
            </Reveal>

            <Reveal className="retreat-helps-col" delay={120}>
              <h2 className="retreat-section-eyebrow">Facilitated by</h2>
              <div className="retreat-facilitators">
                {FACILITATORS.map((f) => (
                  <div className="retreat-facilitator" key={f.name}>
                    <div className="retreat-facilitator-photo">
                      {f.photo ? (
                        <img
                          src={f.photo}
                          alt={`Portrait of ${f.name}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="grief-facilitator-initials" aria-hidden="true">
                          {f.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="retreat-facilitator-body">
                      <h4>{f.name}</h4>
                      <p className="grief-facilitator-role">{f.role}</p>
                      <p className="grief-facilitator-org">{f.org}</p>
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
            <h2 className="retreat-section-eyebrow center">Series details</h2>
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
                <Sparkles size={20} />
              </div>
              <p>
                Small group size for genuine connection — please register early
                to reserve your spot in the fall cohort.
              </p>
            </div>
          </Reveal>

          <Reveal className="retreat-osstf grief-callout" delay={100}>
            <div className="retreat-osstf-icon">
              <Heart size={22} />
            </div>
            <div>
              <h4>Insurance &amp; benefits coverage</h4>
              <p>
                As a Registered Social Worker, Christine&rsquo;s portion of the
                program is often eligible for coverage under extended health
                benefits or insurance plans. We&rsquo;ll provide a receipt for
                submission — reach out if you&rsquo;d like help confirming your
                coverage.
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
                Grief doesn&rsquo;t have to be carried <em>alone</em>.
              </h2>
              <p>
                This 6-week series is for anyone navigating loss — recent or
                long-held. Whether you&rsquo;re grieving a person, a
                relationship, an identity, or a chapter of life, you&rsquo;re
                welcome here.
              </p>

              <ul className="retreat-register-list">
                <li>
                  <Heart size={16} /> 6-week series &mdash; $425 + HST per person
                </li>
                <li>
                  <Heart size={16} /> Tuesdays, 6:30 – 8:00pm · Oct 20 – Nov 26, 2026
                </li>
                <li>
                  <Heart size={16} /> St Peter&rsquo;s United Church, York St
                </li>
                <li>
                  <Heart size={16} /> Receipt provided for insurance / benefits
                </li>
              </ul>

              <p className="retreat-register-contact">
                Questions? Email Christine at{' '}
                <a href="mailto:cmcinnes4@gmail.com">cmcinnes4@gmail.com</a> or
                call <a href="tel:+12494442437">(249) 444-2437</a>.
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
                    Thank you for reserving your spot in the Living &amp;
                    Moving with Grief series. Christine will be in touch within
                    one business day with payment details and everything
                    you&rsquo;ll need before the first session.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="form-eyebrow">Registration Form</div>
                  <h3>Reserve your spot</h3>
                  <p>
                    Fill in your details below and Christine will follow up
                    with payment and confirmation details.
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
                      <label htmlFor="attendees">
                        Number of attendees
                      </label>
                      <select
                        id="attendees"
                        name="attendees"
                        value={form.attendees}
                        onChange={onChange}
                      >
                        <option value="1">Just me</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="yogaExperience">Yoga experience</label>
                      <select
                        id="yogaExperience"
                        name="yogaExperience"
                        value={form.yogaExperience}
                        onChange={onChange}
                      >
                        {YOGA_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="benefitsCoverage">
                      Insurance / benefits coverage
                    </label>
                    <select
                      id="benefitsCoverage"
                      name="benefitsCoverage"
                      value={form.benefitsCoverage}
                      onChange={onChange}
                    >
                      {BENEFITS_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="accessibility">
                      Accessibility or mobility needs <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="accessibility"
                      name="accessibility"
                      type="text"
                      value={form.accessibility}
                      onChange={onChange}
                      placeholder="e.g. seated modifications, chair-only, mobility considerations"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">
                      Anything you&rsquo;d like Christine &amp; Dawn to know? <span className="opt">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={form.notes}
                      onChange={onChange}
                      placeholder="Questions, context you'd like us to hold, or anything else on your mind…"
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
    </div>
  )
}
