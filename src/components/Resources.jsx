import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Download, Heart, Mail, Printer } from 'lucide-react'
import { SELF_CARE_SECTIONS, buildSelfCarePlan, validateSelfCarePlan } from '../../lambda/selfCarePlan.mjs'
import { withBase } from '../lib/navigate'
import './Resources.css'

const localDate = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function PlanField({ field, value, onChange }) {
  if (field.options) {
    return (
      <fieldset className="plan-fieldset">
        <legend>{field.label}</legend>
        <p className="plan-field-hint">{field.type === 'checkbox' ? 'Choose any that apply.' : 'Choose one, or leave this question blank.'}</p>
        <div className="plan-options">
          {field.options.map(option => (
            <label className="plan-option" key={option}>
              <input type={field.type} name={field.id} value={option}
                checked={field.type === 'checkbox' ? (value || []).includes(option) : value === option}
                onChange={event => onChange(field.id, field.type === 'checkbox'
                  ? event.target.checked ? [...(value || []), option] : (value || []).filter(selected => selected !== option)
                  : option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {field.type === 'radio' && value && <button type="button" className="plan-clear" onClick={() => onChange(field.id, '')}>Clear selection</button>}
      </fieldset>
    )
  }
  return (
    <div className="form-group">
      <label htmlFor={field.id}>{field.label}</label>
      {field.type === 'textarea'
        ? <textarea id={field.id} rows={3} maxLength={1500} value={value || ''} onChange={event => onChange(field.id, event.target.value)} />
        : <input id={field.id} type="text" maxLength={100} value={value || ''} onChange={event => onChange(field.id, event.target.value)} />}
    </div>
  )
}

export default function Resources() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [date, setDate] = useState(localDate)
  const [answers, setAnswers] = useState({})
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const stepHeading = useRef(null)
  const review = step === SELF_CARE_SECTIONS.length
  const hasAnswers = Object.values(answers).some(value => Array.isArray(value) ? value.length : value.trim())

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Resources & Self-Care Plan | ACTive Minds Therapy'
    return () => { document.title = previousTitle }
  }, [])

  useEffect(() => {
    if (!hasAnswers || sent) return
    const beforeUnload = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [hasAnswers, sent])

  const moveTo = next => {
    setStep(next)
    setError('')
    requestAnimationFrame(() => {
      stepHeading.current?.focus({ preventScroll: true })
      document.getElementById('self-care-walkthrough')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const updateAnswer = (id, value) => {
    setAnswers(current => ({ ...current, [id]: value }))
    setSent(false)
  }

  const downloadPlan = () => {
    const plan = buildSelfCarePlan({ name, date, answers })
    const url = URL.createObjectURL(new Blob([plan.html], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'my-completed-self-care-plan.html'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const sendPlan = async event => {
    event.preventDefault()
    if (sending) return
    const data = { formType: 'self-care', name, date, answers, email, consent, website }
    const validationError = validateSelfCarePlan(data)
    if (validationError) { setError(validationError); return }
    setSending(true)
    setError('')
    try {
      const response = await fetch(import.meta.env.VITE_CONTACT_API_URL || '/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        signal: AbortSignal.timeout(30000),
      })
      if (!response.ok) throw new Error('Send failed')
      setSent(true)
    } catch {
      setError('Your plan could not be emailed. Your answers are still here. Please try again, or save a copy below.')
    } finally { setSending(false) }
  }

  return (
    <section className="resources-page" aria-labelledby="resources-heading">
      <div className="container-narrow">
        <header className="resources-header">
          <span className="eyebrow">Resources</span>
          <h1 id="resources-heading">A little space <em>to care for yourself.</em></h1>
          <p>Practical tools to help you pause, reflect, and take a small step toward your well-being. Start wherever you are.</p>
        </header>

        <article className="resource-card">
          <div className="resource-icon"><Heart size={28} aria-hidden="true" /></div>
          <div>
            <span className="eyebrow">Free worksheet · 4 pages</span>
            <h2>My self-care plan</h2>
            <p>Explore nutrition, rest, movement, responsibilities, relationships, and community. Notice what is working and choose small, realistic changes that feel useful for you.</p>
            <div className="resource-actions">
              <a className="btn btn-primary" href="#self-care-walkthrough" onClick={() => { setStarted(true); requestAnimationFrame(() => stepHeading.current?.focus({ preventScroll: true })) }}>
                {started ? 'Continue my plan' : 'Create my plan online'} <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="btn btn-secondary" href={withBase('/resources/my-self-care-plan.pdf')} download><Download size={17} aria-hidden="true" /> Download PDF</a>
            </div>
            <p className="resource-note">Prefer pen and paper? Download the worksheet, or fill out its form fields in a PDF reader. No email needed.</p>
          </div>
        </article>

        {started && <section className="plan-walkthrough" id="self-care-walkthrough" aria-labelledby="plan-step-heading">
          <div className="plan-progress">
            <span aria-live="polite">{review ? 'Review & keep your plan' : `Step ${step + 1} of ${SELF_CARE_SECTIONS.length}`}</span>
            <progress max={SELF_CARE_SECTIONS.length + 1} value={step + 1} aria-label="Self-care plan progress" />
          </div>
          <h2 id="plan-step-heading" tabIndex={-1} ref={stepHeading}>{review ? 'Your plan, at your pace.' : SELF_CARE_SECTIONS[step].title}</h2>
          <p className="plan-intro">{review ? 'Take a moment to look over your reflections. You can go back to any section, save a copy, or have your plan emailed to you.' : 'There are no right or wrong answers. Every question is optional. Choose what feels useful for you.'}</p>
          {!review ? <>
            {step === 0 && <div className="plan-details">
              <div className="form-group"><label htmlFor="plan-name">Name (optional)</label><input id="plan-name" autoComplete="name" maxLength={100} value={name} onChange={event => { setName(event.target.value); setSent(false) }} /></div>
              <div className="form-group"><label htmlFor="plan-date">Date</label><input type="date" id="plan-date" value={date} onChange={event => { setDate(event.target.value); setSent(false) }} /></div>
            </div>}
            {SELF_CARE_SECTIONS[step].fields.map(field => <PlanField key={field.id} field={field} value={answers[field.id]} onChange={updateAnswer} />)}
          </> : <>
            <div className="plan-review" id="printable-self-care-plan">
              <h3>My self-care plan</h3>
              <p>{name && <><strong>Name:</strong> {name}<br /></>}<strong>Date:</strong> {date || 'Not provided'}</p>
              {SELF_CARE_SECTIONS.map((section, index) => <section className="plan-review-section" key={section.title}>
                <div className="plan-review-title"><h3>{section.title}</h3><button className="plan-clear" type="button" onClick={() => moveTo(index)} aria-label={`Edit ${section.title}`}>Edit</button></div>
                {section.fields.filter(field => Array.isArray(answers[field.id]) ? answers[field.id].length : answers[field.id]?.trim()).length
                  ? <dl>{section.fields.map(field => {
                    const value = answers[field.id]
                    if (!(Array.isArray(value) ? value.length : value?.trim())) return null
                    return <div key={field.id}><dt>{field.label}</dt><dd>{Array.isArray(value) ? value.join(', ') : value}</dd></div>
                  })}</dl>
                  : <p className="resource-note">You left this section open for now.</p>}
              </section>)}
            </div>
            <aside className="plan-reminder">Self-care does not have to be perfect. Small, consistent steps can make a difference. Aim for progress, not perfection.</aside>
            <div className="plan-email">
              {sent ? <div role="status" className="plan-sent"><CheckCircle aria-hidden="true" /><div><h3>Your plan is on its way</h3><p>We sent a copy to {email}. Check your inbox and spam folder. You can also save a copy below.</p></div></div> : <form onSubmit={sendPlan}>
                <h3>Keep a copy in your inbox</h3>
                <p>We will email your completed reflections to the address you choose.</p>
                <div className="form-group"><label htmlFor="plan-email">Email address</label><input id="plan-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} disabled={sending} /></div>
                <label className="plan-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} disabled={sending} /><span>I agree to have my answers sent through the email service to this address. I understand email may not be private.</span></label>
                <div className="plan-honeypot" aria-hidden="true"><label htmlFor="plan-website">Website</label><input id="plan-website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
                {error && <p className="plan-error" role="alert">{error}</p>}
                <button className="btn btn-primary" type="submit" disabled={sending || !hasAnswers}><Mail size={17} aria-hidden="true" />{sending ? 'Sending your plan…' : 'Email my plan'}</button>
                <p className="resource-note">Your answers are used to send this email. They are not saved in our website’s submissions dashboard or sent to the practice team. Your email is not added to a mailing list.</p>
              </form>}
              <div className="resource-actions">
                <button type="button" className="btn btn-secondary" disabled={!hasAnswers} onClick={downloadPlan}><Download size={17} aria-hidden="true" />Save my plan</button>
                <button type="button" className="btn btn-secondary" disabled={!hasAnswers} onClick={() => window.print()}><Printer size={17} aria-hidden="true" />Print / save as PDF</button>
              </div>
            </div>
          </>}
          <div className="plan-navigation">
            <button className="btn btn-ghost" type="button" disabled={step === 0 || sending} onClick={() => moveTo(step - 1)}><ArrowLeft size={17} aria-hidden="true" />Back</button>
            {!review && <button className="btn btn-primary" type="button" onClick={() => moveTo(step + 1)}>{step === SELF_CARE_SECTIONS.length - 1 ? 'Review my plan' : 'Continue'}<ArrowRight size={17} aria-hidden="true" /></button>}
          </div>
          <p className="resource-note plan-privacy">Your reflections stay in this tab until you choose to email them. Save a copy before closing or leaving this page.</p>
        </section>}

        <aside className="resources-coming-soon"><span className="eyebrow">Growing with you</span><h2>More resources coming soon</h2><p>We are making room for more tools to support your well-being. Come back and explore what is new.</p></aside>
      </div>
    </section>
  )
}
