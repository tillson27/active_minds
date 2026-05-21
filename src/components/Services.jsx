import { Heart, Briefcase, GraduationCap, Presentation, Check } from 'lucide-react'
import Reveal from './Reveal'

const SERVICES = [
  {
    num: '01',
    icon: Heart,
    label: 'For Individuals, Couples & Families',
    title: 'Therapy & counselling',
    description:
      'A range of services to help you navigate trauma, grief and loss, anxiety and depression, self-esteem, stress, life transitions, anger, addiction, abuse, workplace stress, and the day-to-day work of finding balance. Our approach is grounded in evidence-based therapy and offered in a safe, compassionate, non-judgmental space.',
    details: [
      'Individual, couples & family therapy',
      'In-person and secure virtual sessions',
      'Flexible appointment times',
      'Coverage through most extended health plans',
    ],
    price: '$150 – $200 per session',
    tag: 'Most welcomed',
  },
  {
    num: '02',
    icon: Briefcase,
    label: 'For Organizations',
    title: 'Consulting services',
    description:
      'Expert consultation that supports organizations in building healthy, responsive workplaces. We bring insight into the social and emotional dynamics that shape culture, wellbeing, and client outcomes — and partner with you on practical, tailored strategies for sustainable change.',
    details: [
      'Workplace mental health strategy',
      'Psychological safety & culture work',
      'Leadership coaching & team support',
      'Tailored to your context and goals',
    ],
    tag: 'For workplaces',
  },
  {
    num: '03',
    icon: GraduationCap,
    label: 'For Social Workers',
    title: 'Clinical supervision',
    description:
      'Reflective, collaborative clinical supervision aligned with the standards of the Ontario College of Social Workers and Social Service Workers. Designed to strengthen your practice, support complex case work, and build confidence and clarity over time.',
    details: [
      'Reflect on practice & grow your skill',
      'Navigate complex cases with support',
      'Strengthen self-awareness & accountability',
      'Grounded in 55+ years of combined experience',
    ],
    tag: 'OCSWSSW aligned',
  },
  {
    num: '04',
    icon: Presentation,
    label: 'For Groups & Teams',
    title: 'Training & workshops',
    description:
      'Training delivered in a safe, inclusive, and engaging learning environment. We address complex social and mental health topics with a holistic perspective, tailoring each session to your team’s context, goals, and learning needs.',
    details: [
      'Trauma-informed practice training',
      'Cultural awareness & responsiveness',
      'Mental health literacy for staff',
      'Custom-built to your team and context',
    ],
    tag: 'Custom built',
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <Reveal className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Services</span>
          <h2 className="section-title">
            Four ways we can <em>support you</em>.
          </h2>
          <p className="section-lead">
            We provide guidance, support, and tools to help you navigate
            life&rsquo;s difficulties — meeting individuals where they are and
            partnering with professionals and organizations on meaningful,
            sustainable change.
          </p>
        </Reveal>

        <div className="services-list">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} className="service-row" delay={i * 60}>
                <div className="service-row-num">{s.num}</div>
                <div className="service-row-body">
                  <span className="eyebrow" style={{ marginBottom: '0.6rem' }}>
                    <Icon size={14} />
                    {s.label}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <ul>
                    {s.details.map((d) => (
                      <li key={d}>
                        <Check />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="service-row-meta">
                  <span className="service-row-tag">{s.tag}</span>
                  {s.price && <span className="service-row-price">{s.price}</span>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
