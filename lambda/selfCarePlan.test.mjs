import test from 'node:test'
import assert from 'node:assert/strict'
import { SELF_CARE_SECTIONS, buildSelfCarePlan, validateSelfCarePlan } from './selfCarePlan.mjs'

const validPlan = () => ({
  formType: 'self-care', email: 'visitor@example.com', consent: true,
  name: 'Sam', date: '2026-10-21', answers: { weeklyGoal: 'Take a break each afternoon.' },
})

test('plan validation accepts optional sections and rejects invalid consent, answers, and recipients', () => {
  assert.equal(SELF_CARE_SECTIONS.length, 7)
  assert.equal(validateSelfCarePlan(validPlan()), null)
  for (const changes of [
    { consent: false }, { consent: 'true' }, { email: 'invalid' },
    { email: 'visitor@example.com,another@example.com' },
    { answers: {} }, { answers: [] }, { name: {} }, { date: '' },
    { answers: { weeklyGoal: 'a'.repeat(1501) } },
    { answers: { nutritionHabits: 'Regular meals' } },
    { answers: { nutritionHabits: ['Unrecognized habit'] } },
    { answers: { movementFrequency: 'Sometimes' } },
  ]) assert.ok(validateSelfCarePlan({ ...validPlan(), ...changes }), JSON.stringify(changes))
})

test('email preserves reflections safely and includes only known, answered fields', () => {
  const { html, text } = buildSelfCarePlan({ ...validPlan(), name: '<script>name</script>', answers: {
    weeklyGoal: '<img src=x onerror=alert(1)>\nTake time for café, 🌿 and 家人.',
    nutritionHabits: ['Regular meals', 'Drinking enough water'], unknown: 'Must not appear',
  } })
  assert.ok(html.includes('&lt;script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(!html.includes('<img'))
  assert.ok(html.includes('café, 🌿 and 家人.'))
  assert.ok(html.includes('Regular meals, Drinking enough water'))
  assert.ok(text.includes('<img src=x onerror=alert(1)>'))
  assert.ok(!text.includes('Must not appear'))
  assert.ok(!text.includes('Sleep & rest'))
})

test('handler sends only to the visitor, skips storage, and reports provider failures', async () => {
  process.env.RESEND_API_KEY = 'test-key'
  process.env.SUBMISSIONS_TABLE = 'must-not-write-to-this-table'
  const { handler } = await import('./contact.mjs')
  const calls = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) })
    return { ok: true, json: async () => ({ id: 'test-email' }) }
  }
  const invoke = data => handler({ body: JSON.stringify(data), requestContext: { http: { method: 'POST' } } })
  try {
    assert.equal((await invoke(validPlan())).statusCode, 200)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.resend.com/emails')
    assert.deepEqual(calls[0].body.to, ['visitor@example.com'])
    assert.ok(!calls[0].body.cc)
    assert.ok(!calls[0].body.bcc)
    assert.ok(calls[0].body.text.includes('Take a break each afternoon.'))
    assert.equal((await invoke({ ...validPlan(), consent: false })).statusCode, 400)
    assert.equal((await invoke({ ...validPlan(), website: 'bot' })).statusCode, 200)
    assert.equal(calls.length, 1)
    globalThis.fetch = async () => ({ ok: false, status: 503, text: async () => 'Unavailable' })
    assert.equal((await invoke(validPlan())).statusCode, 502)
  } finally { globalThis.fetch = originalFetch }
})
