import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Video from './components/Video'
import Specializations from './components/Specializations'
import Services from './components/Services'
import Team from './components/Team'
import Programs from './components/Programs'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Retreat from './components/Retreat'
import Admin from './components/Admin'

const stripBase = (pathname) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (base && pathname?.startsWith(base)) return pathname.slice(base.length) || '/'
  return pathname || '/'
}

const isRetreatPath = (pathname) => /^\/retreat\/?$/i.test(stripBase(pathname))
const isAdminPath = (pathname) => /^\/admin\/?$/i.test(stripBase(pathname))

function App() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    const onSpaNav = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    window.addEventListener('spa:navigate', onSpaNav)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('spa:navigate', onSpaNav)
    }
  }, [])

  if (isAdminPath(path)) {
    return <Admin />
  }

  if (isRetreatPath(path)) {
    return (
      <>
        <Navbar variant="retreat" />
        <main id="main">
          <Retreat />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Video />
        <Specializations />
        <Services />
        <Team />
        <Programs />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
