import { useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { withBase, handleSpaClick } from '../lib/navigate'

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'specializations', label: 'Approach' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Our Team' },
  { id: 'programs', label: 'Programs' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar({ variant }) {
  const onRetreat = variant === 'retreat'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev
      document.body.classList.toggle('menu-open', next)
      return next
    })
  }, [])

  const close = useCallback(() => {
    setMenuOpen(false)
    document.body.classList.remove('menu-open')
  }, [])

  const sectionHref = (id) => (onRetreat ? `${withBase('/')}#${id}` : `#${id}`)
  const brandHref = onRetreat ? withBase('/') : '#top'
  const brandClick = (e) => {
    close()
    if (onRetreat) handleSpaClick('/')(e)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Primary">
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="navbar-inner">
        <a href={brandHref} className="nav-brand" onClick={brandClick} aria-label="ACTive Minds Therapy home">
          <Logo height={52} markOnly className="nav-brand-mark" />
          <span className="nav-brand-text">
            <span className="nav-brand-name">ACTive Minds</span>
            <span className="nav-brand-tag">Your Pathway to Wellbeing</span>
          </span>
        </a>

        <button
          className="mobile-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={sectionHref(item.id)} onClick={close}>{item.label}</a>
            </li>
          ))}
          <li>
            {onRetreat ? (
              <a
                href="#register"
                className="btn btn-primary nav-cta"
                onClick={close}
              >
                Register
              </a>
            ) : (
              <a
                href="https://activemindstherapyconsulting.janeapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary nav-cta"
                onClick={close}
              >
                Book Free Consult
              </a>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}
