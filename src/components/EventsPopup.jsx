import { useEffect, useState } from 'react'
import { Calendar, Sparkles, X, ArrowRight } from 'lucide-react'

const DISMISS_KEY = 'activeMindsEventsPopupDismissed'
const SHOW_AFTER_MS = 400 // short beat so it slides in intentionally, not on first paint
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 // don't re-nag for 24h after dismiss

const hasRecentlyDismissed = () => {
  if (typeof window === 'undefined') return true
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return false
    return Date.now() - dismissedAt < SESSION_TTL_MS
  } catch {
    return false
  }
}

const markDismissed = () => {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

export default function EventsPopup() {
  const [open, setOpen] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    if (hasRecentlyDismissed()) return

    const trigger = () => {
      setOpen(true)
      // let the DOM paint first, then apply the enter class
      window.requestAnimationFrame(() => setEntering(true))
    }

    const timer = window.setTimeout(trigger, SHOW_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const close = () => {
    setEntering(false)
    markDismissed()
    window.setTimeout(() => setOpen(false), 250)
  }

  const goToEvents = (e) => {
    e.preventDefault()
    const target = document.getElementById('events')
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    close()
  }

  if (!open) return null

  return (
    <div
      className={`events-popup${entering ? ' open' : ''}`}
      role="dialog"
      aria-labelledby="events-popup-title"
      aria-describedby="events-popup-body"
    >
      <button
        className="events-popup-close"
        type="button"
        onClick={close}
        aria-label="Dismiss events invitation"
      >
        <X size={16} />
      </button>

      <div className="events-popup-icon" aria-hidden="true">
        <Sparkles size={18} />
      </div>

      <div className="events-popup-body">
        <div className="events-popup-eyebrow">
          <Calendar size={13} /> New this fall
        </div>
        <h3 id="events-popup-title">Check out our upcoming events</h3>
        <p id="events-popup-body">
          Registration for our fall grief series is open. The school-year
          wellness retreat is closed for now &mdash; we expect to run it again
          soon.
        </p>
        <div className="events-popup-actions">
          <a
            href="#events"
            className="btn btn-primary events-popup-cta"
            onClick={goToEvents}
          >
            See events <ArrowRight size={14} className="arrow" />
          </a>
          <button
            type="button"
            className="events-popup-later"
            onClick={close}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
