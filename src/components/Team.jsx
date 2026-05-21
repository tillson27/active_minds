import { ExternalLink } from 'lucide-react'
import Reveal from './Reveal'
import alisonImg from '../assets/team/alison.jpg'
import christineImg from '../assets/team/christine.jpg'
import triciaImg from '../assets/team/tricia.jpg'

const TEAM = [
  {
    name: 'Alison Orford',
    photo: alisonImg,
    creds: 'MSW, RSW',
    bio:
      'A Registered Social Worker who brings empathetic, individualized counselling to clients across Ontario. Alison offers virtual sessions and in-person appointments from the practice’s Manitoulin Island location.',
    tags: ['Individual Therapy', 'Trauma', 'Anxiety & Depression'],
    href: 'https://activemindstherapyconsulting.janeapp.com/locations/alison-orford/book',
  },
  {
    name: 'Christine McInnes',
    photo: christineImg,
    creds: 'MSW, RSW',
    bio:
      'A Registered Social Worker with deep experience supporting clients through loss, life transitions, and complex emotional terrain. Christine also co-facilitates the Living & Moving with Grief program.',
    tags: ['Grief & Loss', 'Trauma', 'Mindfulness'],
    href: 'https://activemindstherapyconsulting.janeapp.com/locations/christine-mcinnes/book',
  },
  {
    name: 'Tricia Goeldner',
    photo: triciaImg,
    creds: 'MSW, BEd, RSW',
    bio:
      'A Registered Social Worker with a Master of Social Work and Bachelor of Education. Tricia brings a trauma-informed, mindfulness-based approach and is also a yoga instructor and mindfulness facilitator outside her clinical work.',
    tags: ['Trauma-Informed', 'Mindfulness', 'Clinical Supervision'],
    href: 'https://activemindstherapyconsulting.janeapp.com/locations/tricia-goeldner/book',
  },
]

export default function Team() {
  return (
    <section className="team" id="team">
      <div className="container">
        <Reveal className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Our Team</span>
          <h2 className="section-title">
            Three social workers. One <em>shared commitment</em>.
          </h2>
          <p className="section-lead">
            ACTive Minds is led by three Registered Social Workers who, together,
            bring more than 55 years of experience to the work — and who chose
            to build a practice that puts people first.
          </p>
        </Reveal>

        <div className="team-grid">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} className="team-card" delay={i * 100}>
              <div className="team-photo">
                <img src={m.photo} alt={`Portrait of ${m.name}`} loading="lazy" />
              </div>
              <div className="team-card-body">
                <div>
                  <h3>{m.name}</h3>
                  <p className="team-creds">{m.creds}</p>
                </div>
                <p className="team-bio">{m.bio}</p>
                <div className="team-tags">
                  {m.tags.map((t) => (
                    <span key={t} className="team-tag">{t}</span>
                  ))}
                </div>
                <a
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-link"
                >
                  Book with {m.name.split(' ')[0]} <ExternalLink />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="team-collective">
          We&rsquo;re a <em>collective by design</em> — three independent
          clinicians, working alongside one another so our clients always have
          a thoughtful network of support behind them.
        </Reveal>
      </div>
    </section>
  )
}
