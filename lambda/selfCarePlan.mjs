const text = (id, label, type = 'textarea') => ({ id, label, type })
const choices = (id, label, options, type = 'checkbox') => ({ id, label, options, type })

export const SELF_CARE_SECTIONS = [
  {
    title: 'Nutrition & hydration',
    fields: [
      choices('nutritionHabits', 'What best describes my current habits?', ['Regular meals', 'Breakfast most days', 'Fruits and vegetables', 'Protein with meals', 'Drinking enough water', 'More caffeine than I would like', 'Skipping meals', 'Eating when stressed or upset', 'Other']),
      text('nutritionOther', 'Other habits (if any)'),
      text('nutritionWorking', 'What is working well for me?'),
      text('nutritionGoal', 'What would I like to change or maintain?'),
      text('nutritionStep', 'One small step I could take:'),
    ],
  },
  {
    title: 'Sleep & rest',
    fields: [
      text('sleepHours', 'Average hours of sleep:', 'text'),
      choices('sleepHabits', 'Which of these describe my sleep?', ['Consistent bedtime', 'Consistent wake time', 'Sleep feels restorative', 'Difficulty falling asleep', 'Wake during the night', 'Wake feeling tired', 'Screens before bed', 'Other']),
      text('sleepOther', 'Other sleep habits (if any)'),
      text('sleepRoutine', 'What would a realistic sleep or rest routine look like?'),
      text('sleepStep', 'One small step I could take:'),
    ],
  },
  {
    title: 'Physical activity & movement',
    fields: [
      choices('movementFrequency', 'How often am I physically active?', ['Rarely', '1–2 days per week', '3–4 days per week', '5 or more days per week'], 'radio'),
      text('movementEnjoy', 'Activities or movement I currently enjoy:'),
      text('movementInterest', 'Movement I would like to include, if any:'),
      text('movementGoal', 'A realistic frequency or duration:'),
      text('movementStep', 'One small step I could take:'),
    ],
  },
  {
    title: 'Work, school & responsibilities',
    fields: [
      choices('responsibilityLevel', 'How manageable do my responsibilities feel?', ['Very manageable', 'Mostly manageable', 'Sometimes overwhelming', 'Frequently overwhelming', 'Extremely overwhelming'], 'radio'),
      choices('responsibilityHabits', 'Which of these feel familiar?', ['I take breaks', 'I set boundaries', 'I make time for myself', 'I bring work home', 'I find it hard to say no', 'I feel pressure to do everything', 'Other']),
      text('responsibilityOther', 'Other responsibilities or habits (if any)'),
      text('balanceVision', 'What would a healthier balance look like for me?'),
      text('boundaryChange', 'A boundary or change I would like to try:'),
    ],
  },
  {
    title: 'Social support & relationships',
    fields: [
      choices('supportPeople', 'Who can I turn to for support?', ['Family', 'Friends', 'Partner or spouse', 'Counsellor or therapist', 'Healthcare provider', 'Support group', 'Other']),
      text('supportOther', 'Other sources of support (if any)'),
      choices('connectionLevel', 'How connected do I feel to others?', ['Very connected', 'Somewhat connected', 'Isolated at times', 'Very isolated'], 'radio'),
      text('peopleToConnect', 'Who would I like to connect with or spend time with?'),
      text('supportStrengthen', 'What could help strengthen my support system?'),
      text('supportStep', 'One small step I could take:'),
    ],
  },
  {
    title: 'Community & meaningful activities',
    fields: [
      choices('communityConnection', 'How connected do I feel to my community?', ['Very connected', 'Somewhat connected', 'Not very connected', 'Isolated'], 'radio'),
      choices('meaningActivities', 'What brings connection, purpose, or enjoyment?', ['Community groups', 'Spiritual community', 'Volunteering', 'Clubs or organizations', 'Classes', 'Hobbies', 'Nature or outdoors', 'Cultural activities', 'Other']),
      text('communityOther', 'Other meaningful activities (if any)'),
      text('communityExplore', 'A community or activity I would like to explore:'),
      text('communityStep', 'One small step I could take:'),
    ],
  },
  {
    title: 'My overall self-care',
    fields: [
      text('overallGoingWell', 'What is going well for me right now?'),
      choices('attentionAreas', 'Which area needs the most attention?', ['Nutrition and hydration', 'Sleep and rest', 'Physical activity', 'Work or school balance', 'Social support', 'Community and connection', 'Emotional well-being', 'Other']),
      text('attentionOther', 'Other areas (if any)'),
      text('readyChange', 'One change I feel ready to make:'),
      text('weeklyGoal', 'My self-care goal for the next week:'),
      text('progressSigns', 'I will know I am making progress when:'),
    ],
  },
]

export function validateSelfCarePlan(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Invalid plan.'
  if (typeof data.email !== 'string' || data.email.length > 254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(data.email.trim())) return 'Please enter a valid email address.'
  if (data.consent !== true) return 'Please agree to have your plan emailed to you.'
  if (typeof data.name !== 'string' || data.name.length > 100) return 'Please use a name of 100 characters or fewer.'
  if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return 'Please choose a date.'
  if (!data.answers || typeof data.answers !== 'object' || Array.isArray(data.answers)) return 'Invalid answers.'
  let hasAnswer = false
  for (const field of SELF_CARE_SECTIONS.flatMap(section => section.fields)) {
    const value = data.answers[field.id]
    if (value === undefined) continue
    if (field.type === 'checkbox') {
      if (!Array.isArray(value) || value.length > field.options.length || value.some(option => !field.options.includes(option))) return 'Invalid selection.'
      if (value.length) hasAnswer = true
    } else {
      if (typeof value !== 'string' || value.length > 1500) return 'Please keep each answer to 1,500 characters or fewer.'
      if (field.type === 'radio' && value && !field.options.includes(value)) return 'Invalid selection.'
      if (value.trim()) hasAnswer = true
    }
  }
  return hasAnswer ? null : 'Add at least one reflection before emailing your plan.'
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export function buildSelfCarePlan(data) {
  const sections = SELF_CARE_SECTIONS.map(section => {
    const answers = section.fields.map(field => {
      const value = data.answers[field.id]
      return { label: field.label, value: (Array.isArray(value) ? value.join(', ') : value || '').trim() }
    }).filter(answer => answer.value)
    return { title: section.title, answers }
  }).filter(section => section.answers.length)
  const reminder = 'Self-care does not have to be perfect. Small, consistent steps can make a difference. Aim for progress, not perfection.'
  const text = ['MY SELF-CARE PLAN', `Name: ${data.name || 'Not provided'}`, `Date: ${data.date}`, ...sections.map(section => `${section.title}\n\n${section.answers.map(answer => `${answer.label}\n${answer.value}`).join('\n\n')}`), reminder, 'ACTive Minds Therapy & Consulting · www.activemindstherapy.com'].join('\n\n')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>My self-care plan</title></head><body style="margin:0;background:#fbf9f4;color:#243530;font:16px/1.7 Arial,sans-serif"><main style="max-width:680px;margin:0 auto;padding:32px 24px"><p style="font-size:12px;letter-spacing:2px">ACTive Minds Therapy &amp; Consulting</p><h1>My self-care plan</h1><p>A practical worksheet for supporting your well-being.</p><p><strong>Name:</strong> ${escapeHtml(data.name || 'Not provided')}<br><strong>Date:</strong> ${escapeHtml(data.date)}</p>${sections.map(section => `<section style="margin:28px 0;border-top:1px solid #c4d6c7;padding-top:16px"><h2 style="font:26px Georgia,serif">${escapeHtml(section.title)}</h2>${section.answers.map(answer => `<p><strong>${escapeHtml(answer.label)}</strong><br><span style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(answer.value)}</span></p>`).join('')}</section>`).join('')}<p style="background:#e3ece4;padding:20px;border-radius:12px">${reminder}</p><p>You requested this copy of your plan. Keep it somewhere that feels private to you. You can print this email or save it as a PDF.</p><a href="https://www.activemindstherapy.com/resources">Explore resources at ACTive Minds</a></main></body></html>`
  return { html, text }
}
