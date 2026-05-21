import { ArrowRight } from 'lucide-react'
import heroPath from '../assets/hero-path.png'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Sudbury &middot; Manitoulin &middot; Ontario</span>
          <h1>
            Your pathway to <em>wellbeing</em> starts here.
          </h1>
          <p className="hero-subtitle">
            ACTive Minds is a collective of registered social workers providing
            compassionate, evidence-based counselling, clinical supervision,
            training, and consulting — for individuals, families, and the
            organizations that support them.
          </p>

          <div className="hero-actions">
            <a
              href="https://activemindstherapyconsulting.janeapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Book a Free Consultation <ArrowRight className="arrow" size={18} />
            </a>
            <a href="#services" className="btn btn-secondary">
              Explore Services
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img
            className="hero-visual-image"
            src={heroPath}
            alt=""
            loading="eager"
            decoding="async"
          />
          <div className="hero-visual-overlay" />
        </div>

        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="num">55+</span>
            <span className="lbl">Years Combined Experience</span>
          </div>
          <div className="hero-meta-item">
            <span className="num">3</span>
            <span className="lbl">Registered Social Workers</span>
          </div>
          <div className="hero-meta-item hero-meta-item--wide">
            <span className="num">In-Person &amp; Virtual</span>
            <span className="lbl">Across Ontario</span>
          </div>
        </div>
      </div>
    </section>
  )
}
