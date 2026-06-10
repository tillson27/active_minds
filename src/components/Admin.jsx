import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Download,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  Users,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'
const SESSION_KEY = 'activeMindsAdminSession'

const TABLES = {
  contact: {
    label: 'Contact',
    icon: Inbox,
    columns: [
      { key: 'submittedAt', label: 'Submitted' },
      { key: 'firstName', label: 'First' },
      { key: 'lastName', label: 'Last' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'service', label: 'Service' },
      { key: 'clinician', label: 'Clinician' },
      { key: 'message', label: 'Message', long: true },
    ],
  },
  retreat: {
    label: 'Retreat',
    icon: Users,
    columns: [
      { key: 'submittedAt', label: 'Submitted' },
      { key: 'firstName', label: 'First' },
      { key: 'lastName', label: 'Last' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'location', label: 'Location' },
      { key: 'role', label: 'Role' },
      { key: 'organization', label: 'Organization' },
      { key: 'pdFund', label: 'PD Fund' },
      { key: 'dietary', label: 'Dietary', long: true },
      { key: 'notes', label: 'Notes', long: true },
    ],
  },
}

const parseStoredSession = () => {
  if (typeof window === 'undefined') return null
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
    if (!session?.token || Date.parse(session.expiresAt) <= Date.now()) return null
    return session
  } catch {
    return null
  }
}

const formatDate = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const csvEscape = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export default function Admin() {
  const [session, setSession] = useState(parseStoredSession)
  const [password, setPassword] = useState('')
  const [activeType, setActiveType] = useState('contact')
  const [submissions, setSubmissions] = useState({ contact: [], retreat: [] })
  const [cursors, setCursors] = useState({ contact: null, retreat: null })
  const [loaded, setLoaded] = useState({ contact: false, retreat: false })
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(new Set())
  const activeLoaded = loaded[activeType]

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setSession(null)
    setPassword('')
  }, [])

  const callAdmin = useCallback(async (body) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }
    return data
  }, [])

  const loadSubmissions = useCallback(
    async (type, { append = false, cursor = null } = {}) => {
      const token = session?.token
      if (!token) return
      const requestKey = `${type}:${cursor || 'first'}`
      if (inFlight.current.has(requestKey)) return
      inFlight.current.add(requestKey)
      append ? setLoadingMore(true) : setLoading(true)
      setError('')

      try {
        const data = await callAdmin({
          action: 'adminList',
          token,
          submissionType: type,
          cursor,
          limit: 25,
        })
        setSubmissions((current) => ({
          ...current,
          [type]: append
            ? [...current[type], ...(data.submissions || [])]
            : data.submissions || [],
        }))
        setCursors((current) => ({ ...current, [type]: data.nextCursor || null }))
        setLoaded((current) => ({ ...current, [type]: true }))
      } catch (err) {
        if (/expired|session|invalid/i.test(err.message)) clearSession()
        setError(err.message)
      } finally {
        inFlight.current.delete(requestKey)
        append ? setLoadingMore(false) : setLoading(false)
      }
    },
    [callAdmin, clearSession, session],
  )

  useEffect(() => {
    if (session?.token && !activeLoaded) {
      const timer = window.setTimeout(() => {
        loadSubmissions(activeType)
      }, 0)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [activeLoaded, activeType, loadSubmissions, session?.token])

  const onLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await callAdmin({ action: 'adminLogin', password })
      const nextSession = {
        token: data.token,
        expiresAt: data.expiresAt,
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
      setSession(nextSession)
      setPassword('')
      setLoaded({ contact: false, retreat: false })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportCsv = () => {
    const table = TABLES[activeType]
    const rows = submissions[activeType]
    const header = table.columns.map((column) => column.label)
    const body = rows.map((row) =>
      table.columns.map((column) =>
        csvEscape(column.key === 'submittedAt' ? formatDate(row[column.key]) : row[column.key]),
      ),
    )
    const csv = [header.map(csvEscape), ...body].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `active-minds-${activeType}-submissions.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!session?.token) {
    return (
      <main className="admin-page admin-login-page" id="main">
        <section className="admin-login-panel" aria-labelledby="admin-login-heading">
          <div className="admin-brand">ACTive Minds Therapy</div>
          <div className="admin-lock">
            <Lock size={24} />
          </div>
          <h1 id="admin-login-heading">Admin</h1>
          <form onSubmit={onLogin} className="admin-login-form">
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              name="adminPassword"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary admin-login-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spin" size={17} /> Signing in
                </>
              ) : (
                <>
                  <Lock size={17} /> Sign in
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    )
  }

  const table = TABLES[activeType]
  const rows = submissions[activeType]
  const ActiveIcon = table.icon

  return (
    <main className="admin-page" id="main">
      <header className="admin-topbar">
        <div>
          <div className="admin-brand">ACTive Minds Therapy</div>
          <h1>Submissions</h1>
        </div>
        <button className="admin-icon-button" type="button" onClick={clearSession} title="Sign out">
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </header>

      <section className="admin-toolbar" aria-label="Submission tools">
        <div className="admin-tabs" role="tablist" aria-label="Submission type">
          {Object.entries(TABLES).map(([key, config]) => {
            const Icon = config.icon
            return (
              <button
                className={`admin-tab ${activeType === key ? 'active' : ''}`}
                key={key}
                type="button"
                role="tab"
                aria-selected={activeType === key}
                onClick={() => setActiveType(key)}
              >
                <Icon size={16} />
                {config.label}
              </button>
            )
          })}
        </div>
        <div className="admin-actions">
          <button
            className="admin-icon-button"
            type="button"
            onClick={() => loadSubmissions(activeType)}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw className={loading ? 'spin' : ''} size={17} />
            <span>Refresh</span>
          </button>
          <button
            className="admin-icon-button"
            type="button"
            onClick={exportCsv}
            disabled={!rows.length}
            title="Export CSV"
          >
            <Download size={17} />
            <span>CSV</span>
          </button>
        </div>
      </section>

      {error && <div className="admin-error">{error}</div>}

      <section className="admin-table-section" aria-labelledby="admin-table-heading">
        <div className="admin-table-heading">
          <div className="admin-table-title">
            <ActiveIcon size={18} />
            <h2 id="admin-table-heading">{table.label} submissions</h2>
          </div>
          <span>{rows.length} loaded</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.submissionId || `${row.submittedAt}-${row.email}`}>
                  {table.columns.map((column) => (
                    <td className={column.long ? 'long' : ''} key={column.key}>
                      {column.key === 'submittedAt'
                        ? formatDate(row[column.key])
                        : row[column.key] || ''}
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && !rows.length && (
                <tr>
                  <td className="admin-empty" colSpan={table.columns.length}>
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="admin-loading">
            <Loader2 className="spin" size={18} /> Loading submissions
          </div>
        )}

        {cursors[activeType] && (
          <button
            className="btn btn-secondary admin-load-more"
            type="button"
            onClick={() =>
              loadSubmissions(activeType, {
                append: true,
                cursor: cursors[activeType],
              })
            }
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="spin" size={17} /> Loading
              </>
            ) : (
              'Load more'
            )}
          </button>
        )}
      </section>
    </main>
  )
}
