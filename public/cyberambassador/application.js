const API_ROOT = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:4000/api'
  : `${window.location.origin}/api`

const form = document.querySelector('#applicationForm')
const birthDateInput = document.querySelector('#dateOfBirth')
const ageInput = document.querySelector('#age')
const formAlert = document.querySelector('#formAlert')
const submitButton = document.querySelector('#submitButton')
const otherInterestToggle = document.querySelector('#otherInterestToggle')
const otherInterestField = document.querySelector('#otherInterestField')
const selectedCompany = document.querySelector('#selectedCompany')
const otherCompanyField = document.querySelector('#otherCompanyField')

function calculateAge(dateValue) {
  if (!dateValue) return null
  const birthDate = new Date(`${dateValue}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age -= 1
  return age
}

birthDateInput.addEventListener('change', () => {
  const age = calculateAge(birthDateInput.value)
  ageInput.value = Number.isInteger(age) ? age : ''
})

otherInterestToggle.addEventListener('change', () => {
  otherInterestField.hidden = !otherInterestToggle.checked
  otherInterestField.querySelector('input').required = otherInterestToggle.checked
})

selectedCompany.addEventListener('change', () => {
  const showOther = selectedCompany.value === 'Other'
  otherCompanyField.hidden = !showOther
  otherCompanyField.querySelector('input').required = showOther
})

function showError(message) {
  formAlert.textContent = message
  formAlert.classList.add('show')
  formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  formAlert.classList.remove('show')

  const age = calculateAge(birthDateInput.value)
  if (age === null || age < 15 || age > 24) {
    showError('Les candidats doivent avoir entre 15 et 24 ans.')
    return
  }

  const formData = new FormData(form)
  const interests = formData.getAll('interests')
  if (!interests.length) {
    showError('Veuillez sélectionner au moins un centre d’intérêt lié au programme.')
    return
  }

  const payload = Object.fromEntries(formData.entries())
  payload.age = age
  payload.interests = interests
  payload.declarations = {
    accurate: formData.get('accurate') === 'on',
    noSelectionGuarantee: formData.get('noSelectionGuarantee') === 'on',
    participationCommitment: formData.get('participationCommitment') === 'on',
  }
  delete payload.accurate
  delete payload.noSelectionGuarantee
  delete payload.participationCommitment

  submitButton.disabled = true
  submitButton.innerHTML = '<i class="ri-loader-4-line"></i> Envoi en cours...'

  try {
    const response = await fetch(`${API_ROOT}/cyberambassador/inscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Votre candidature n’a pas pu être envoyée. Veuillez réessayer.')

    document.querySelector('#applicationContent').innerHTML = `<div class="container"><div class="success-card"><span class="success-icon"><i class="ri-check-line"></i></span><span class="kicker">Candidature reçue</span><h2 class="section-title center">Merci pour votre candidature !</h2><p class="section-copy center">Votre candidature au programme CyberAmbassador a bien été envoyée. Seuls les candidats présélectionnés seront invités à l’évaluation de culture numérique.</p><a class="btn btn-primary" href="/cyberambassador/"><i class="ri-arrow-left-line"></i> Retour au programme</a></div></div>`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    const message = error instanceof TypeError && error.message === 'Failed to fetch'
      ? 'Le serveur de candidature est indisponible. Vérifiez que l’API est démarrée, puis réessayez.'
      : error.message
    showError(message)
    submitButton.disabled = false
    submitButton.innerHTML = 'Envoyer ma candidature <i class="ri-arrow-right-line"></i>'
  }
})
