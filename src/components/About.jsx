import { Users, HeartHandshake, Sprout, Globe } from 'lucide-react'
import Reveal from './Reveal'

const PILLARS = [
  {
    icon: HeartHandshake,
    title: 'A collaborative process',
    body: 'The "ACT" in ACTive Minds reflects our belief that therapy is an active process — meaningful change comes from the engagement of both therapist and client.',
  },
  {
    icon: Sprout,
    title: 'Evidence-based and human',
    body: 'We pair proven, research-backed approaches with warmth, curiosity, and a non-judgmental presence so you feel safe to show up exactly as you are.',
  },
  {
    icon: Globe,
    title: 'Culturally responsive care',
    body: 'We honour the diversity of our clients and provide sensitive, effective treatment that acknowledges the unique experiences of every individual.',
  },
  {
    icon: Users,
    title: 'A collective, not a corporation',
    body: 'Three Registered Social Workers, more than 55 years of combined experience, and one shared commitment to the people and communities we serve.',
  },
]

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <Reveal className="section-header about-header">
          <span className="eyebrow">About the Collective</span>
          <h2 className="section-title">
            Counselling that meets you <em>where you are</em>.
          </h2>
          <p className="section-lead">
            ACTive Minds Therapy &amp; Consulting was founded by three Registered
            Social Workers — Alison Orford, Christine McInnes, and Tricia
            Goeldner — who came together to offer Sudbury, Manitoulin, and
            all of Ontario a more thoughtful, human kind of care.
          </p>
        </Reveal>

        <Reveal className="about-content" delay={120}>
          <p className="lede">
            We believe healing happens in relationship — in a space where you
            feel seen, heard, and supported without judgment.
          </p>
          <p>
            Our team specializes in grief, loss, and trauma, and works with
            individuals, couples, and families navigating anxiety, depression,
            addiction, life transitions, and the everyday weight of being
            human. We also support the helpers — offering clinical supervision,
            training, and consulting to social workers and organizations
            across the province.
          </p>
          <p>
            Whether you are beginning your therapeutic journey or seeking
            professional consultation and support for your team, we approach
            every connection with compassion, professionalism, clarity, and
            respect.
          </p>
        </Reveal>

        <div className="about-pillars">
          {PILLARS.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal key={p.title} className="about-pillar" delay={140 + i * 80}>
                <div className="about-pillar-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
