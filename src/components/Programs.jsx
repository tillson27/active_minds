import { Sparkles, HeartHandshake, Leaf, ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import { withBase, handleSpaClick } from '../lib/navigate'

const PROGRAMS = [
  {
    icon: Leaf,
    label: 'Wellness Retreat · Registration closed',
    title: 'Preparing for the School Year — A Full-Day Retreat',
    body:
      'A full-day experiential retreat for school professionals — teachers, EAs, counsellors, and school-based clinicians. Develop grounding strategies, strengthen self-compassion, and build an individualized wellness plan for the year ahead. Nature-based mindfulness, guided reflection, and practical tools.',
    meta: [
      { key: 'Investment', val: '$200' },
      { key: 'Next dates', val: 'To be announced' },
    ],
    facilitators: (
      <>
        <strong>Facilitated by</strong> Tricia Goeldner, MSW, RSW &amp; Alison
        Orford, MSW, RSW. Registration for the August 2026 dates is closed —
        we expect to run this retreat again soon. Email{' '}
        <a href="mailto:tricia@activemindstherapy.com">
          tricia@activemindstherapy.com
        </a>{' '}
        to hear about the next one.
      </>
    ),
    cta: 'Learn more',
    href: '/retreat',
    warm: false,
  },
  {
    icon: HeartHandshake,
    label: 'New · Fall 2026 Cohort',
    title: 'Living & Moving with Grief',
    body:
      'A combined grief therapy and gentle yoga experience that offers a safe, non-judgmental space to share, learn, and connect with others who are grieving. Participants explore how the body responds to grief and practice mindful movements designed to ease physical stress. No yoga experience required.',
    meta: [
      { key: 'Investment', val: '$425 + HST' },
      { key: 'Dates', val: 'Oct 20 – Nov 26, 2026' },
    ],
    facilitators: (
      <>
        <strong>Facilitated by</strong> Christine McInnes, MSW, RSW (ACTive
        Minds) &amp; Dawn Condon, Certified Yoga Therapist (Connected Living
        Yoga &amp; Wellness).
      </>
    ),
    cta: 'Learn more & register',
    href: '/grief-program',
    warm: false,
  },
  {
    icon: Sparkles,
    label: 'Group Program',
    title: 'Mindfulness-Based Cognitive Therapy (MBCT)',
    body:
      'Designed for individuals experiencing difficulties with stress, anxiety, low mood, or recurring depression. Research-backed protocol delivered by ACTive Minds clinicians.',
    meta: [
      { key: 'Duration', val: '8 weeks · 2.5 hrs / wk' },
      { key: 'Format', val: 'Group + retreat day' },
    ],
    facilitators: null,
    cta: 'Register interest',
    href: '#contact',
    warm: true,
  },
]

export default function Programs() {
  return (
    <section className="programs" id="events" aria-labelledby="events-heading">
      <div className="container">
        <Reveal className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Events</span>
          <h2 id="events-heading" className="section-title">
            Upcoming events <em>built for moments that matter</em>.
          </h2>
          <p className="section-lead">
            Beyond one-to-one therapy, we run focused events and group programs
            that combine evidence-based practice with the support of a
            thoughtful, intentional community.
          </p>
        </Reveal>

        <div className="programs-grid">
          {PROGRAMS.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal
                key={p.title}
                className={`program-card${p.warm ? ' warm' : ''}`}
                delay={i * 90}
              >
                <div className={`program-card-banner${p.warm ? ' warm' : ''}`}>
                  <div className="program-card-banner-icon">
                    <Icon size={26} />
                  </div>
                </div>
                <div className="program-card-body">
                  <span className="label">{p.label}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>

                  <div className="program-meta">
                    {p.meta.map((m) => (
                      <div className="program-meta-item" key={m.key}>
                        <span className="key">{m.key}</span>
                        <span className="val">{m.val}</span>
                      </div>
                    ))}
                  </div>

                  {p.facilitators && (
                    <p className="program-facilitators">{p.facilitators}</p>
                  )}

                  <div className="program-card-actions">
                    <a
                      href={p.href.startsWith('/') && !p.href.startsWith('/#') ? withBase(p.href) : p.href}
                      onClick={
                        p.href.startsWith('/') && !p.href.startsWith('/#')
                          ? handleSpaClick(p.href)
                          : undefined
                      }
                      className="btn btn-primary"
                    >
                      {p.cta} <ArrowRight className="arrow" size={16} />
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
