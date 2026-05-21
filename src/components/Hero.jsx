import { ArrowRight, Leaf } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <svg
        className="hero-pathway"
        viewBox="0 0 1440 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pathway-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9bb8a1" stopOpacity="0.0" />
            <stop offset="35%" stopColor="#6f9579" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3f5d52" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path
          d="M -40 640 C 220 580, 320 520, 480 460 S 820 360, 980 280 S 1280 160, 1500 60"
          fill="none"
          stroke="url(#pathway-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 10"
        />
        <path
          d="M -40 660 C 240 600, 360 540, 520 480 S 860 380, 1020 300 S 1320 180, 1540 80"
          fill="none"
          stroke="#9bb8a1"
          strokeOpacity="0.35"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
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
          <svg
            className="hero-visual-path"
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="visual-path-gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#fbf9f4" stopOpacity="0" />
                <stop offset="40%" stopColor="#fbf9f4" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#fbf9f4" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="visual-path-edge" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#fbf9f4" stopOpacity="0" />
                <stop offset="60%" stopColor="#fbf9f4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fbf9f4" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            {/* Soft pathway widening toward the viewer */}
            <path
              d="M 200 -20 C 180 80, 130 180, 100 260 S 60 420, 30 520 L 370 520 C 340 420, 300 320, 280 240 S 230 80, 200 -20 Z"
              fill="url(#visual-path-gradient)"
            />
            {/* Path edges */}
            <path
              d="M 200 -20 C 180 80, 130 180, 100 260 S 60 420, 30 520"
              fill="none"
              stroke="url(#visual-path-edge)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 200 -20 C 220 80, 270 180, 300 260 S 340 420, 370 520"
              fill="none"
              stroke="url(#visual-path-edge)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Stepping marks along the path */}
            {[
              { cx: 200, cy: 30, r: 3 },
              { cx: 178, cy: 110, r: 3.5 },
              { cx: 152, cy: 200, r: 4 },
              { cx: 122, cy: 300, r: 4.5 },
              { cx: 88, cy: 410, r: 5 },
            ].map((m, i) => (
              <circle
                key={i}
                cx={m.cx}
                cy={m.cy}
                r={m.r}
                fill="#fbf9f4"
                opacity={0.35 + i * 0.08}
              />
            ))}
          </svg>
          <div className="hero-visual-quote">
            <span className="quote-mark">&ldquo;</span>
            <blockquote>
              Hope is being able to see that there is light despite all of the
              darkness.
            </blockquote>
            <cite>&mdash; Desmond Tutu</cite>
          </div>
          <Leaf className="hero-visual-leaf" size={160} />
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
