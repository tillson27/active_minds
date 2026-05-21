import { useState } from 'react'
import { Play } from 'lucide-react'
import Reveal from './Reveal'

const VIDEO_ID = 'TnbnX7fgkVg'
const POSTER = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`

/**
 * Privacy-preserving YouTube embed: only loads the heavy player iframe
 * after the user explicitly clicks play. Until then, a static thumbnail
 * with a play affordance is shown.
 */
export default function Video() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="video-section" id="watch">
      <div className="container">
        <Reveal className="section-header center">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Watch</span>
          <h2 className="section-title">
            Meet the <em>ACTive Minds collective</em>.
          </h2>
          <p className="section-lead">
            A short introduction to the practice, the people behind it, and the
            kind of care we believe Ontario deserves.
          </p>
        </Reveal>

        <Reveal className="video-frame">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="ACTive Minds Therapy & Consulting — introduction"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="video-poster"
              onClick={() => setPlaying(true)}
              aria-label="Play video: ACTive Minds Therapy introduction"
            >
              <img src={POSTER} alt="" loading="lazy" />
              <span className="video-poster-overlay" aria-hidden="true">
                <span className="video-poster-play">
                  <Play size={28} />
                </span>
                <span className="video-poster-label">Play introduction</span>
              </span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  )
}
