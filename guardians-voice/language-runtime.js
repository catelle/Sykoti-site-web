document.querySelectorAll("#occupation, #digitalIssue, #dailyTime").forEach((select) => {
  select.querySelectorAll("option").forEach((option, index) => {
    if (!option.hasAttribute("value")) option.setAttribute("value", index === 0 ? "" : option.textContent)
  })
})

window.guardianVoiceErrorMessage = (message) => {
  if (document.documentElement.lang !== 'fr') return message
  const messages = {
    'Please review the highlighted fields before submitting your application.':'Veuillez vérifier les champs signalés avant d’envoyer votre candidature.',
    'Enter complete profile links beginning with https://, one per line.':'Saisissez des liens complets commençant par https://, un par ligne.',
    'Please write at least 5 words.':'Veuillez rédiger au moins 5 mots.', 'Please write at least 3 words.':'Veuillez rédiger au moins 3 mots.',
    'Please use no more than 150 words.':'Veuillez ne pas dépasser 150 mots.', 'Please use no more than 100 words.':'Veuillez ne pas dépasser 100 mots.',
    'The application service is unavailable right now. Please check your connection and try again.':'Le service de candidature est momentanément indisponible. Vérifiez votre connexion et réessayez.',
    'Your application could not be submitted. Please try again.':'Votre candidature n’a pas pu être envoyée. Veuillez réessayer.',
    'Please enter your full name.':'Veuillez saisir votre nom complet.', 'Please enter a valid email address.':'Veuillez saisir une adresse e-mail valide.',
    'Enter your WhatsApp number with its country code, beginning with +.':'Saisissez votre numéro WhatsApp avec l’indicatif du pays, en commençant par +.',
    'Please enter a valid age.':'Veuillez saisir un âge valide.', 'Country and city are required.':'Le pays et la ville sont obligatoires.',
    'Please select your current occupation or status.':'Veuillez sélectionner votre occupation ou statut actuel.',
    'Please specify your current occupation or status.':'Veuillez préciser votre occupation ou statut actuel.',
    'One or more selected platforms are invalid.':'Une ou plusieurs plateformes sélectionnées ne sont pas valides.',
    'Social profile links must be valid web addresses, one per line.':'Les liens de profils doivent être des adresses web valides, un par ligne.',
    'Please tell us whether you have created digital content before.':'Veuillez indiquer si vous avez déjà créé du contenu numérique.',
    'The content example must be a valid web address.':'L’exemple de contenu doit être une adresse web valide.',
    'Your motivation must be between 5 and 150 words.':'Votre motivation doit compter entre 5 et 150 mots.',
    'Please select a digital issue.':'Veuillez sélectionner un enjeu numérique.',
    'Please specify the digital issue you want to address.':'Veuillez préciser l’enjeu numérique que vous souhaitez aborder.',
    'Please answer all three challenge commitment questions.':'Veuillez répondre aux trois questions sur votre engagement.',
    'Please select the time you can dedicate each day.':'Veuillez sélectionner le temps que vous pouvez consacrer chaque jour.',
    'Your 30-second answer must be between 3 and 100 words.':'Votre réponse de 30 secondes doit compter entre 3 et 100 mots.',
    'Please accept both confirmation statements.':'Veuillez accepter les deux déclarations de confirmation.',
    'An application has already been submitted with this email address.':'Une candidature a déjà été envoyée avec cette adresse e-mail.',
    'Too many attempts. Please wait a few minutes and try again.':'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.',
  }
  return messages[message] || message
}

const alertBox = document.querySelector('#formAlert')
const submitButton = document.querySelector('#submitButton')
const localizeAlert = () => {
  if (document.documentElement.lang !== 'fr' || !alertBox.textContent) return
  const translated = window.guardianVoiceErrorMessage(alertBox.textContent)
  if (translated !== alertBox.textContent) alertBox.textContent = translated
}
new MutationObserver(localizeAlert).observe(alertBox, { childList:true, characterData:true, subtree:true })

new MutationObserver(() => {
  if (document.documentElement.lang !== 'fr') return
  const text = submitButton.textContent.trim()
  const translated = text.includes('SENDING YOUR APPLICATION') ? 'ENVOI DE VOTRE CANDIDATURE…' : text.includes('APPLY TO BECOME A GUARDIAN VOICE') ? 'DEVENIR CHALLENGER GUARDIANS VOICE →' : null
  if (translated && submitButton.textContent.trim() !== translated) submitButton.textContent = translated
}).observe(submitButton, { childList:true, characterData:true, subtree:true })

new MutationObserver(() => {
  if (document.documentElement.lang !== 'fr') return
  const success = document.querySelector('.success-card')
  if (!success || success.dataset.localized === 'fr') return
  success.dataset.localized = 'fr'
  success.querySelector('.eyebrow').textContent = 'Candidature reçue'
  success.querySelector('h1').textContent = 'Merci de vous être engagé(e).'
  success.querySelector('p').textContent = 'Candidature reçue ! Merci de vous être engagé(e) à utiliser votre voix pour un espace numérique plus sûr. L’équipe de Sykoti Center contactera les Challengers sélectionnés pour leur communiquer les prochaines étapes.'
  success.querySelector('a').textContent = 'Retour à Sykoti Center'
}).observe(document.querySelector('#applicationContent'), { childList:true })

new MutationObserver(() => {
  if (document.documentElement.lang !== 'fr') return
  document.querySelectorAll('label[for]').forEach((label) => {
    const field = document.getElementById(label.htmlFor)
    if (field?.required && !label.querySelector('b')) label.insertAdjacentHTML('beforeend', ' <b>*</b>')
  })
}).observe(document.querySelector('#guardianVoiceForm'), { childList:true, subtree:true })
[HTMLInputElement.prototype, HTMLTextAreaElement.prototype, HTMLSelectElement.prototype].forEach((prototype) => {
  const original = prototype.setCustomValidity
  prototype.setCustomValidity = function (message) { return original.call(this, window.guardianVoiceErrorMessage(message)) }
})
new MutationObserver(() => {
  if (document.documentElement.lang === "fr") document.querySelectorAll(".word-count").forEach((item) => { item.textContent = item.textContent.replace(" words", " mots") })
}).observe(document.querySelector("#guardianVoiceForm"), { childList:true, characterData:true, subtree:true })
