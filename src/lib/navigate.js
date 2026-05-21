export const withBase = (path) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (!path.startsWith('/')) return path
  return `${base}${path}` || '/'
}

export const routeTo = (path) => {
  const full = withBase(path)
  if (typeof window === 'undefined') return
  if (window.location.pathname === full) return
  window.history.pushState({}, '', full)
  window.dispatchEvent(new Event('spa:navigate'))
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export const handleSpaClick = (path) => (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  routeTo(path)
}
