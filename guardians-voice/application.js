const API_ROOT = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:4001/api'
  : `${window.location.origin}/api`

const form = document.querySelector('#guardianVoiceForm')
const alertBox = document.querySelector('#formAlert')
const submitButton = document.querySelector('#submitButton')

const countWords = (value) => value.trim().split(/\s+/).filter(Boolean).length

document.querySelectorAll('[data-max-words]').forEach((field) => {
  const counter = document.querySelector(`[data-count-for="${field.id}"]`)
  const update = () => {
    const count = countWords(field.value)
    const maximum = Number(field.dataset.maxWords)
    counter.textContent = `${count} / ${maximum} words`
    counter.classList.toggle('over', count > maximum)
    field.setCustomValidity(count > maximum ? `Please use no more than ${maximum} words.` : '')
  }
  field.addEventListener('input', update)
  update()
})

function toggleOther(selectId, wrapperId, inputId) {
  const select = document.querySelector(`#${selectId}`)
  const wrapper = document.querySelector(`#${wrapperId}`)
  const input = document.querySelector(`#${inputId}`)
  const update = () => {
    const visible = select.value === 'Other'
    wrapper.hidden = !visible
    input.required = visible
    if (!visible) input.value = ''
  }
  select.addEventListener('change', update)
  update()
}

toggleOther('occupation', 'otherOccupationField', 'otherOccupation')
toggleOther('digitalIssue', 'otherDigitalIssueField', 'otherDigitalIssue')

function showError(message) {
  alertBox.textContent = message
  alertBox.classList.add('show')
  alertBox.focus({ preventScroll: true })
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function profileLinks(value) {
  return value.split(/\n|,/).map((link) => link.trim()).filter(Boolean)
}

function validWebUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  alertBox.classList.remove('show')

  const profilesField = document.querySelector('#socialProfiles')
  const profiles = profileLinks(profilesField.value)
  profilesField.setCustomValidity(profiles.some((link) => !validWebUrl(link)) ? 'Enter complete profile links beginning with https://, one per line.' : '')

  for (const field of document.querySelectorAll('[data-max-words]')) {
    const count = countWords(field.value)
    const maximum = Number(field.dataset.maxWords)
    const minimum = field.id === 'motivation' ? 5 : 3
    field.setCustomValidity(count > maximum ? `Please use no more than ${maximum} words.` : count < minimum ? `Please write at least ${minimum} words.` : '')
  }

  if (!form.checkValidity()) {
    form.reportValidity()
    showError('Please review the highlighted fields before submitting your application.')
    return
  }

  const data = new FormData(form)
  const payload = {
    fullName: data.get('fullName'), email: data.get('email'), whatsapp: data.get('whatsapp'),
    age: Number(data.get('age')), gender: data.get('gender'), country: data.get('country'), city: data.get('city'),
    occupation: data.get('occupation'), otherOccupation: data.get('otherOccupation'),
    platforms: data.getAll('platforms'), socialProfiles: profiles,
    hasCreatedContent: data.get('hasCreatedContent') === 'yes', contentExample: data.get('contentExample'),
    motivation: data.get('motivation'), digitalIssue: data.get('digitalIssue'), otherDigitalIssue: data.get('otherDigitalIssue'),
    trainingCommitment: data.get('trainingCommitment') === 'yes',
    publishingCommitment: data.get('publishingCommitment') === 'yes',
    hasEquipmentAccess: data.get('hasEquipmentAccess') === 'yes',
    dailyTime: data.get('dailyTime'), challengeAnswer: data.get('challengeAnswer'), website: data.get('website'),
    confirmations: {
      selectionAndParticipation: data.get('selectionAndParticipation') === 'on',
      rewardsCriteria: data.get('rewardsCriteria') === 'on',
    },
  }

  submitButton.disabled = true
  submitButton.setAttribute('aria-busy', 'true')
  submitButton.innerHTML = 'SENDING YOUR APPLICATION…'

  try {
    const response = await fetch(`${API_ROOT}/guardians-voice/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.message || 'Your application could not be submitted. Please try again.')

    document.querySelector('#applicationContent').innerHTML = `<section class="success-card" role="status"><span class="success-icon" aria-hidden="true">✓</span><span class="eyebrow">Application received</span><h1>Thank you for stepping forward.</h1><p>Application received! Thank you for stepping forward to use your voice for a safer digital space. The Sykoti Center team will contact selected Challengers with the next steps.</p><a href="../">Return to Sykoti Center</a></section>`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    showError(error instanceof TypeError ? 'The application service is unavailable right now. Please check your connection and try again.' : error.message)
    submitButton.disabled = false
    submitButton.removeAttribute('aria-busy')
    submitButton.innerHTML = 'APPLY TO BECOME A GUARDIAN VOICE <span aria-hidden="true">→</span>'
  }
})
