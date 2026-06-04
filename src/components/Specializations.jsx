import {
  Shield,
  HeartPulse,
  Users,
  Building2,
  GraduationCap,
  Leaf,
} from 'lucide-react'
import Reveal from './Reveal'

const SPECS = [
  {
    icon: Shield,
    title: 'Trauma-informed clinical practice',
    body:
      'We work from a trauma-informed lens that recognizes the impact of lived experience on emotional wellbeing, relationships, and daily life. Our approach prioritizes safety, collaboration, and genuine understanding.',
  },
  {
    icon: HeartPulse,
    title: 'Mental health & emotional wellbeing',
    body:
      'Support for anxiety, depression, emotional overwhelm, grief, and life transitions — building awareness, regulation strategies, and practical tools for everyday stability and resilience.',
  },
  {
    icon: Users,
    title: 'Clinical supervision for social workers',
    body:
      'Reflective supervision aligned with the standards of the Ontario College of Social Workers and Social Service Workers — building confidence, ethical practice, and clinical depth.',
  },
  {
    icon: Building2,
    title: 'Workplace mental health',
    body:
      'Consulting and education that help organizations build healthier, more responsive workplaces — psychological safety, staff wellbeing, and practical strategies for leadership teams.',
  },
  {
    icon: GraduationCap,
    title: 'Training & capacity building',
    body:
      'Engaging, inclusive learning experiences that translate complex mental health and social work concepts into practical knowledge professionals can use right away.',
  },
  {
    icon: Leaf,
    title: 'Mindfulness & somatic approaches',
    body:
      'Mindfulness-based practices for grounding, presence, and regulation — accessible tools designed to support clients in moments of stress, anxiety, and overwhelm.',
  },
]

export default function Specializations() {
  return (
    <section className="specializations" id="specializations" aria-labelledby="specializations-heading">
      <div className="container">
        <Reveal className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Areas of Specialization</span>
          <h2 id="specializations-heading" className="section-title">
            The work we&rsquo;re <em>uniquely trained</em> to do.
          </h2>
          <p className="section-lead">
            These areas reflect our core clinical focus and training. They
            guide the work we do with individuals, professionals, and
            organizations alike.
          </p>
        </Reveal>

        <div className="spec-grid">
          {SPECS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} className="spec-card" delay={i * 70}>
                <div className="spec-icon">
                  <Icon size={22} />
                </div>
                <h3>{s.title}</h3>
                <p className="spec-card-body">{s.body}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
