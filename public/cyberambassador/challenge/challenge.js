const API_ROOT = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:4001/api'
  : `${window.location.origin}/api`

const domains = [
  { name: 'Information et données', icon: 'ri-search-eye-line' },
  { name: 'Communication et collaboration', icon: 'ri-team-line' },
  { name: 'Création de contenu numérique', icon: 'ri-quill-pen-line' },
  { name: 'Sécurité', icon: 'ri-shield-check-line' },
  { name: 'Résolution de problèmes', icon: 'ri-tools-line' },
]

const answerOrders = [
  [1, 3, 0, 2],
  [2, 0, 3, 1],
  [3, 1, 2, 0],
  [0, 2, 1, 3],
]
const questions = [
  [0, '1.1', 'Une alerte virale annonce la fermeture immédiate d’un service public. Que faites-vous habituellement ?', ['Je la crois si elle vient d’une personne de confiance ou circule beaucoup.', 'Je cherche le titre sur Internet et lis quelques publications qui en parlent.', 'Je retrouve la source originale, contrôle la date et le contexte, puis confirme auprès d’une source indépendante.', 'Je réalise systématiquement ces contrôles, vérifie aussi les images et conserve les preuves permettant à quelqu’un de reproduire ma vérification.']],
  [0, '1.2', 'Vous devez utiliser un chiffre important dans une présentation. Comment le validez-vous ?', ['Je reprends le chiffre s’il paraît cohérent et vient d’un site connu.', 'Je vérifie l’auteur, la date et compare avec un autre site.', 'Je retrouve les données ou l’étude d’origine, examine la méthode et croise plusieurs sources indépendantes.', 'Je documente la méthode, les limites et les conflits d’intérêts, puis je peux défendre ou corriger l’analyse devant un groupe.']],
  [0, '1.3', 'Votre téléphone ou ordinateur est perdu. Quelles données pouvez-vous récupérer ?', ['Je risque de perdre la plupart de mes fichiers ou je ne sais pas.', 'Je retrouve certains fichiers envoyés par messagerie ou stockés en ligne.', 'Mes fichiers importants sont organisés et sauvegardés automatiquement ; j’ai déjà testé une restauration.', 'J’applique la règle de plusieurs copies sur supports distincts, chiffre les données sensibles et teste régulièrement la restauration.']],
  [1, '2.1', 'Vous devez annoncer une décision sensible à une équipe. Comment choisissez-vous le canal ?', ['J’utilise l’application que tout le monde consulte le plus.', 'Je choisis entre appel, message ou e-mail selon l’urgence.', 'J’évalue urgence, confidentialité, accessibilité et besoin de trace, puis j’adapte le message aux destinataires.', 'Je définis et fais appliquer une pratique d’équipe combinant canaux, règles d’escalade, accessibilité et archivage.']],
  [1, '2.2', 'Avant de partager un document avec un groupe externe, que contrôlez-vous ?', ['Je vérifie surtout que le lien s’ouvre.', 'Je relis le document et choisis les destinataires.', 'Je contrôle droits d’accès, données cachées, source, licence et durée du partage.', 'J’ai déjà conçu et expliqué à un groupe une procédure de publication, validation, retrait et gestion d’incident.']],
  [1, '2.3', 'Une personne débute avec un service public numérique. Que savez-vous faire ?', ['Je peux lui indiquer le site ou lui conseiller de demander de l’aide.', 'Je peux lui montrer les étapes que je connais en manipulant à sa place.', 'Je lui explique les étapes avec des mots simples, la laisse pratiquer et vérifie qu’elle peut recommencer seule.', 'J’ai déjà animé un accompagnement structuré, adapté aux difficultés du public, puis mesuré son autonomie.']],
  [1, '2.4', 'Vous collaborez à distance sur un projet. Quelle pratique avez-vous réellement mise en place ?', ['Nous échangeons surtout des fichiers dans une messagerie.', 'J’utilise un document partagé et participe aux commentaires.', 'J’organise droits, versions, tâches et règles de contribution pour éviter doublons et pertes.', 'Je coordonne régulièrement plusieurs contributeurs, traite les conflits de version et améliore le processus après bilan.']],
  [1, '2.5', 'Un échange en ligne devient agressif. Comment intervenez-vous ?', ['Je quitte la conversation, bloque la personne ou réponds sur le même ton.', 'Je rappelle les règles de politesse ou demande à un responsable d’intervenir.', 'Je désamorce l’échange, protège la personne visée, conserve les preuves utiles et explique clairement les voies de signalement.', 'J’ai déjà formé ou accompagné un groupe à prévenir ces situations et à appliquer un protocole de modération.']],
  [1, '2.6', 'Vous coordonnez un document contenant des données sensibles. Que faites-vous ?', ['Je l’envoie au groupe en demandant de rester discret.', 'Je partage un lien et demande de ne pas le transférer.', 'Je limite les accès, attribue le minimum de droits et retire les autorisations à la fin.', 'Je définis rôles, durée d’accès, journal de versions et protocole de fuite, puis je vérifie que l’équipe les applique.']],
  [2, '3.1', 'Vous devez créer un contenu pour faire agir un public précis. Quelle expérience avez-vous ?', ['Je publie des photos, vidéos ou textes simples.', 'Je modifie un modèle existant pour rendre le contenu plus attractif.', 'Je pars d’un objectif et d’un public, structure le message, produis le contenu et vérifie sa compréhension.', 'Je conçois régulièrement des contenus accessibles, les teste avec le public et les améliore à partir de résultats mesurés.']],
  [2, '3.2', 'Vous devez transformer un rapport en vidéo courte et accessible. Que savez-vous faire seul ?', ['Je copie les principales phrases dans une vidéo ou un diaporama.', 'J’assemble texte, images et musique à partir d’un modèle.', 'Je synthétise, scénarise et combine plusieurs formats avec sous-titres, attribution et cohérence visuelle.', 'Je maîtrise ce flux de production, contrôle l’accessibilité et la qualité, et peux apprendre la méthode à une autre personne.']],
  [2, '3.3', 'Un groupe veut réutiliser images, musique et texte trouvés en ligne. Que faites-vous ?', ['Je les utilise s’ils sont accessibles publiquement.', 'Je demande de citer les auteurs lorsque leurs noms sont disponibles.', 'Je vérifie chaque licence, sa compatibilité avec l’usage et conserve la preuve de l’autorisation.', 'Je sais expliquer simplement ces choix, corriger les erreurs du groupe et lui fournir une méthode réutilisable de publication conforme.']],
  [2, '3.4', 'Vous publiez une vidéo comportant des ressources externes. Quelle pratique appliquez-vous ?', ['Je choisis les ressources qui correspondent au message.', 'Je mentionne les auteurs dans la description.', 'Je vérifie les licences, conserve les preuves et attribue correctement chaque ressource.', 'Je contrôle aussi la compatibilité des licences, documente les transformations et justifie la licence choisie pour l’œuvre finale.']],
  [3, '4.1', 'Quelles protections avez-vous effectivement configurées sur vos appareils ?', ['Un code simple ou une protection physique, sans réglage régulier.', 'Un verrouillage correct et des mises à jour quand elles sont proposées.', 'Mises à jour automatiques, verrouillage robuste, sauvegarde testée, double authentification et permissions contrôlées.', 'J’applique aussi chiffrement, récupération, moindre privilège et plan de réponse à incident sur plusieurs appareils.']],
  [3, '4.2', 'Une personne connue demande en urgence des données personnelles. Que faites-vous ?', ['Je réponds si le compte ou le numéro semble correct.', 'Je pose une question de contrôle dans la même conversation.', 'Je vérifie par un canal déjà connu, transmets le strict minimum et protège le fichier.', 'J’évalue aussi base légale, conservation et destinataires, documente la décision et sais piloter le signalement d’une fuite.']],
  [3, '4.3', 'Un jeune vous confie subir du cyberharcèlement. Que pouvez-vous faire ?', ['Je lui conseille d’ignorer les messages ou de quitter le réseau.', 'Je l’aide à bloquer le compte et à en parler à un proche.', 'Je l’écoute sans l’exposer, préserve les preuves, sécurise ses comptes et l’oriente vers les bons relais.', 'J’ai déjà accompagné ou sensibilisé des jeunes avec une méthode sûre, des limites claires et un suivi adapté.']],
  [3, '4.4', 'Vous recevez une demande Mobile Money urgente avec un code à communiquer. Que faites-vous ?', ['Je vérifie le nom affiché avant de suivre les instructions.', 'Je pose des questions et rappelle le numéro indiqué dans le message.', 'Je ne partage aucun code, contacte la personne par un numéro déjà connu et vérifie auprès de l’opérateur.', 'Je sécurise aussi les comptes, préserve les preuves, coordonne le signalement et aide les personnes exposées sans diffuser leurs données.']],
  [4, '5.1', 'Un appareil tombe en panne avant une activité. Comment procédez-vous ?', ['Je demande à une personne plus expérimentée de choisir quoi faire.', 'Je redémarre, vérifie les branchements et cherche le message d’erreur.', 'Je reproduis le problème, isole les causes, teste une hypothèse à la fois et documente la solution.', 'Je collecte les diagnostics, évalue le risque des corrections, prévois le retour arrière et transforme la solution en procédure testée.']],
  [4, '5.2', 'Une association demande un nouvel outil. Comment formulez-vous une recommandation ?', ['Je recommande l’outil que je connais le mieux.', 'Je compare quelques fonctions et le prix.', 'Je recueille les besoins, contraintes, compétences et risques, puis teste les options avec de vrais utilisateurs.', 'Je conduis une analyse traçable incluant accessibilité, protection des données, coût complet, réversibilité et indicateurs de succès.']],
  [4, '5.3', 'Vous devez résoudre un besoin sans solution évidente. Quelle pratique avez-vous ?', ['J’attends qu’une application adaptée soit recommandée.', 'J’essaie plusieurs applications ou modèles existants.', 'Je reformule le besoin, prototype une solution, la teste avec les personnes concernées et l’améliore.', 'Je mène régulièrement ce cycle, mesure les effets et transmets à d’autres une méthode qu’ils peuvent reproduire.']],
  [4, '5.4', 'Votre équipe adopte un nouvel outil. Comment assurez-vous son appropriation ?', ['Je choisis l’outil et montre rapidement où cliquer.', 'Je fais une démonstration et reste disponible pour les questions.', 'Je diagnostique les niveaux, explique avec des exemples, fais pratiquer chacun et vérifie l’autonomie avant de partir.', 'J’ai déjà conçu et animé une formation inclusive, fourni des supports réutilisables et mesuré l’adoption pour ajuster l’accompagnement.']],
]

const transmissionQuestionIndexes = [5, 7, 11, 15, 20]

const state = { step: -1, answers: Array(questions.length).fill(null), profile: {}, result: null }
const gateView = document.querySelector('#gateView')
const quizView = document.querySelector('#quizView')
const resultView = document.querySelector('#resultView')
const questionView = document.querySelector('#questionView')
const profileFields = document.querySelector('#profileFields')
const nextButton = document.querySelector('#nextButton')
const previousButton = document.querySelector('#previousButton')
const quizError = document.querySelector('#quizError')

document.querySelector('#openQuizButton').addEventListener('click', () => {
  gateView.hidden = true
  quizView.hidden = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

function renderQuestion() {
  const question = questions[state.step]
  profileFields.hidden = true
  questionView.hidden = false
  const orderedAnswers = answerOrders[state.step % answerOrders.length]
  questionView.innerHTML = `<span class="question-number">Compétence ${question[1]}</span><h1>${question[2]}</h1><p>Choisissez le niveau le plus élevé que vous avez réellement pratiqué sans assistance au cours des six derniers mois. Vous devez pouvoir donner un exemple concret.</p><div class="answer-list">${orderedAnswers.map((answerIndex) => `<label class="answer-option"><input type="radio" name="answer" value="${answerIndex + 1}" ${state.answers[state.step] === answerIndex + 1 ? 'checked' : ''}><span>${question[3][answerIndex]}</span></label>`).join('')}</div>`
  const completed = state.answers.filter(Boolean).length
  document.querySelector('#progressText').textContent = `Question ${state.step + 1} sur ${questions.length}`
  document.querySelector('#progressPercent').textContent = `${Math.round((completed / questions.length) * 100)} %`
  document.querySelector('#progressBar').style.width = `${(completed / questions.length) * 100}%`
  const domain = domains[question[0]]
  document.querySelector('#domainLabel').innerHTML = `<i class="${domain.icon}"></i><span>Domaine ${question[0] + 1}<strong>${domain.name}</strong></span>`
  previousButton.hidden = false
  nextButton.innerHTML = state.step === questions.length - 1 ? 'Voir mon profil <i class="ri-award-line"></i>' : 'Suivant <i class="ri-arrow-right-line"></i>'
  quizError.textContent = ''
}

nextButton.addEventListener('click', async () => {
  quizError.textContent = ''
  if (state.step === -1) {
    const emailInput = document.querySelector('#participantEmail')
    if (!emailInput.checkValidity()) { quizError.textContent = 'Saisissez l’adresse e-mail utilisée pour votre candidature.'; emailInput.focus(); return }
    const nameInput = document.querySelector('#participantName')
    if (!nameInput.value.trim()) { quizError.textContent = 'Saisissez votre nom et prénom.'; nameInput.focus(); return }
    nextButton.disabled = true
    nextButton.innerHTML = '<i class="ri-loader-4-line"></i> Vérification...'
    try {
      const response = await fetch(`${API_ROOT}/cyberambassador/cybercomp/access`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailInput.value }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Impossible de vérifier cette candidature.')
      state.profile = { name: nameInput.value.trim(), email: data.applicant.email, feedbackSubmitted: data.applicant.feedbackSubmitted, age: document.querySelector('#participantAge').value, city: document.querySelector('#participantCity').value.trim(), phase: document.querySelector('#assessmentPhase').value }
      state.step = 0
      renderQuestion()
    } catch (error) {
      quizError.textContent = error instanceof TypeError ? 'Le service CyberComp est momentanément indisponible.' : error.message
    } finally {
      nextButton.disabled = false
      if (state.step === -1) nextButton.innerHTML = 'Commencer <i class="ri-arrow-right-line"></i>'
    }
    return
  }
  const selected = document.querySelector('input[name="answer"]:checked')
  if (!selected) { quizError.textContent = 'Choisissez une réponse avant de continuer.'; return }
  state.answers[state.step] = Number(selected.value)
  if (state.step === questions.length - 1) { showResults(); return }
  state.step += 1
  renderQuestion()
  document.querySelector('.quiz-card').scrollIntoView({ behavior: 'smooth', block: 'start' })
})

previousButton.addEventListener('click', () => {
  if (state.step === 0) {
    state.step = -1; profileFields.hidden = false; questionView.hidden = true; previousButton.hidden = true
    nextButton.innerHTML = 'Commencer <i class="ri-arrow-right-line"></i>'
    return
  }
  state.step -= 1
  renderQuestion()
})

function resultForAnswers(answers) {
  const ratio = answers.reduce((sum, value) => sum + value, 0) / (answers.length * 4)
  const transmissionAnswers = transmissionQuestionIndexes.map(index => answers[index])
  const transmissionAverage = transmissionAnswers.reduce((sum, value) => sum + value, 0) / transmissionAnswers.length
  const demonstratedTransmission = transmissionAnswers.filter(value => value >= 3).length
  const canTransmit = transmissionAverage >= 3 && demonstratedTransmission >= 3
  const canLeadTransmission = transmissionAverage >= 3.6 && transmissionAnswers.every(value => value >= 3)

  if (ratio <= .65) return { level: 'Fondation', text: 'Vous posez les bases de votre autonomie numérique.', guidance: 'Entraînez-vous sur des situations concrètes : vérifier une source, sécuriser vos comptes, organiser vos données et expliquer un geste simple à une autre personne.' }
  if (ratio <= .82 || !canTransmit) return { level: 'Intermédiaire', text: canTransmit ? 'Vous êtes autonome dans plusieurs usages et consolidez encore vos pratiques.' : 'Vous possédez des connaissances numériques, mais devez encore développer votre capacité à les transmettre.', guidance: canTransmit ? 'Rendez vos pratiques plus régulières, documentées et reproductibles.' : 'Exercez-vous à expliquer simplement, faire pratiquer sans faire à la place de l’autre et vérifier son autonomie.' }
  if (ratio <= .93 || !canLeadTransmission) return { level: 'Avancé', text: 'Vous combinez autonomie numérique et capacité à accompagner les autres.', guidance: 'Structurez vos supports, mesurez les acquis de vos publics et approfondissez les domaines où votre score reste plus faible.' }
  return { level: 'Hautement spécialisé', text: 'Vous maîtrisez des pratiques exigeantes et savez organiser leur transmission.', guidance: 'Mettez cette expertise au service de la communauté par le mentorat, la formation et l’évaluation de l’impact.' }
}

async function showResults() {
  const total = state.answers.reduce((sum, value) => sum + value, 0)
  const domainScores = domains.map((domain, index) => {
    const relevant = questions.map((question, questionIndex) => ({ question, score: state.answers[questionIndex] })).filter(item => item.question[0] === index)
    return { ...domain, score: relevant.reduce((sum, item) => sum + item.score, 0), max: relevant.length * 4 }
  })
  state.result = { total, domainScores, ...resultForAnswers(state.answers), date: new Date() }
  nextButton.disabled = true
  nextButton.innerHTML = '<i class="ri-loader-4-line"></i> Enregistrement...'
  try {
    const response = await fetch(`${API_ROOT}/cyberambassador/cybercomp/results`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: state.profile.email, phase: state.profile.phase, answers: state.answers, domains: domainScores.map(({ name, score, max }) => ({ name, score, max })) }) })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Vos résultats n’ont pas pu être enregistrés.')
  } catch (error) {
    quizError.textContent = error instanceof TypeError ? 'Le service CyberComp est indisponible. Réessayez avant de quitter cette page.' : error.message
    nextButton.disabled = false
    nextButton.innerHTML = 'Réessayer l’enregistrement <i class="ri-refresh-line"></i>'
    return
  }
  quizView.hidden = true
  resultView.hidden = false
  document.querySelector('#resultLevel').textContent = `Profil ${state.result.level}`
  document.querySelector('#resultSummary').textContent = `${state.profile.name}, ${state.result.text}`
  document.querySelector('#resultScore').textContent = `${total} / ${questions.length * 4}`
  document.querySelector('#domainResults').innerHTML = domainScores.map((domain, index) => `<article class="domain-result"><span class="domain-result-icon"><i class="${domain.icon}"></i></span><div><span>Domaine ${index + 1}</span><h2>${domain.name}</h2><div class="domain-meter"><span style="width:${(domain.score / domain.max) * 100}%"></span></div><strong>${domain.score} / ${domain.max}</strong></div></article>`).join('')
  document.querySelector('#guidanceTitle').textContent = `Votre prochaine étape : progresser et transmettre`
  document.querySelector('#guidanceText').textContent = state.result.guidance
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (!state.profile.feedbackSubmitted) window.setTimeout(() => document.querySelector('#feedbackDialog').showModal(), 900)
}

function createResultPdf() {
  const clean = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7e]/g, '-')
  const escapePdf = value => clean(value).replace(/([\\()])/g, '\\$1')
  const wrap = (value, limit) => clean(value).split(/\s+/).reduce((lines, word) => {
    const candidate = `${lines.at(-1) || ''} ${word}`.trim()
    if (candidate.length > limit && lines.at(-1)) lines.push(word)
    else lines[lines.length - 1] = candidate
    return lines
  }, [''])
  const text = (value, x, y, size = 10, font = 'F1', color = '0.15 0.15 0.17') => `${color} rg BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdf(value)}) Tj ET`
  const rect = (x, y, width, height, color, radius = 0) => radius
    ? `${color} rg ${x + radius} ${y} m ${x + width - radius} ${y} l ${x + width} ${y} ${x + width} ${y + radius} ${x + width} ${y + radius} c ${x + width} ${y + height - radius} l ${x + width} ${y + height} ${x + width - radius} ${y + height} ${x + width - radius} ${y + height} c ${x + radius} ${y + height} l ${x} ${y + height} ${x} ${y + height - radius} ${x} ${y + height - radius} c ${x} ${y + radius} l ${x} ${y} ${x + radius} ${y} ${x + radius} ${y} c f`
    : `${color} rg ${x} ${y} ${width} ${height} re f`
  const rose = '0.83 0.17 0.38'
  const dark = '0.15 0.15 0.17'
  const muted = '0.40 0.39 0.42'
  const pale = '0.99 0.93 0.95'
  const pages = []
  const first = []

  first.push(rect(0, 0, 595, 842, '1 1 1'), rect(0, 826, 595, 16, rose), rect(0, 590, 595, 236, dark))
  first.push(text('SYKOTICENTER', 46, 786, 10, 'F2', '1 1 1'), text('CYBERAMBASSADOR  /  CYBERCOMP', 46, 768, 8, 'F1', '0.96 0.60 0.72'))
  first.push(text('MON PROFIL', 46, 708, 28, 'F2', '1 1 1'), text('NUMERIQUE', 46, 674, 28, 'F2', '1 1 1'))
  first.push(text(state.profile.name, 46, 626, 12, 'F2', '1 1 1'), text(`Evaluation ${state.profile.phase}  -  ${state.result.date.toLocaleDateString('fr-FR')}`, 46, 608, 9, 'F1', '0.78 0.78 0.80'))
  first.push(rect(385, 636, 158, 122, rose, 14), text(String(state.result.total), 417, 694, 40, 'F2', '1 1 1'), text(`/ ${questions.length * 4}`, 478, 699, 14, 'F1', '1 1 1'), text(`PROFIL ${state.result.level.toUpperCase()}`, 402, 663, 9, 'F2', '1 1 1'))
  first.push(text('VOTRE POSITIONNEMENT', 46, 550, 9, 'F2', rose), text(state.result.text, 46, 525, 14, 'F2', dark))
  first.push(text('VOS 5 DOMAINES', 46, 480, 9, 'F2', rose))
  state.result.domainScores.forEach((domain, index) => {
    const y = 440 - index * 48
    const percent = Math.round(domain.score / domain.max * 100)
    first.push(text(`${index + 1}. ${domain.name}`, 46, y + 15, 10, 'F2', dark), text(`${domain.score}/${domain.max}`, 500, y + 15, 9, 'F2', dark))
    first.push(rect(46, y, 497, 7, '0.92 0.91 0.92', 3), rect(46, y, 497 * percent / 100, 7, rose, 3))
  })
  first.push(rect(46, 112, 497, 92, pale, 12), text('VOTRE PROCHAINE ETAPE', 66, 178, 9, 'F2', rose))
  wrap(state.result.guidance, 78).slice(0, 3).forEach((line, index) => first.push(text(line, 66, 153 - index * 16, 10, 'F1', dark)))
  first.push(text('Auto-evaluation adaptee de DigComp 2.2  -  Ce resultat ne constitue pas une certification.', 46, 56, 8, 'F1', muted), text('01', 529, 56, 8, 'F2', rose))
  pages.push(first.join('\n'))

  const detailChunks = [questions.slice(0, 11), questions.slice(11)]
  detailChunks.forEach((chunk, pageIndex) => {
    const commands = [rect(0, 0, 595, 842, '1 1 1'), rect(0, 826, 595, 16, rose), text('CYBERCOMP  /  DETAIL DE VOS REPONSES', 46, 786, 10, 'F2', dark), text('Vos reponses decrivent vos habitudes actuelles. Elles ne sont ni bonnes ni mauvaises.', 46, 766, 9, 'F1', muted)]
    let y = 724
    chunk.forEach((question, chunkIndex) => {
      const index = pageIndex === 0 ? chunkIndex : chunkIndex + 11
      const selectedAnswer = question[3][state.answers[index] - 1]
      commands.push(rect(46, y - 48, 497, 62, pageIndex % 2 ? '0.98 0.98 0.98' : '0.99 0.97 0.98', 7))
      commands.push(text(`${question[1]}  ${question[2]}`, 60, y - 7, 9, 'F2', dark))
      wrap(selectedAnswer, 88).slice(0, 2).forEach((line, lineIndex) => commands.push(text(line, 60, y - 27 - lineIndex * 13, 8, 'F1', muted)))
      y -= 60
    })
    commands.push(text('SykotiCenter CyberAmbassador  -  Challenge CyberComp', 46, 42, 8, 'F1', muted), text(String(pageIndex + 2).padStart(2, '0'), 529, 42, 8, 'F2', rose))
    pages.push(commands.join('\n'))
  })

  const objects = ['', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>']
  const pageIds = pages.map(stream => {
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    const contentId = objects.length
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`)
    return objects.length
  })
  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

document.querySelector('#downloadButton').addEventListener('click', () => {
  if (!state.result) return
  const blob = createResultPdf()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `resultats-cybercomp-${state.profile.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'profil'}.pdf`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
})

document.querySelector('#printButton').addEventListener('click', () => {
  if (!state.result) return
  const pdfUrl = URL.createObjectURL(createResultPdf())
  const printWindow = window.open(pdfUrl, '_blank')
  if (!printWindow) return
  window.setTimeout(() => { printWindow.print(); URL.revokeObjectURL(pdfUrl) }, 1200)
})
document.querySelector('#feedbackClose').addEventListener('click', () => document.querySelector('#feedbackDialog').close())
document.querySelectorAll('.star-button').forEach((button) => {
  button.addEventListener('click', () => {
    const selectedRating = Number(button.dataset.rating)
    document.querySelector('#ratingValue').value = selectedRating
    document.querySelectorAll('.star-button').forEach((star) => {
      const selected = Number(star.dataset.rating) <= selectedRating
      star.classList.toggle('active', selected)
      star.setAttribute('aria-checked', String(Number(star.dataset.rating) === selectedRating))
    })
  })
})
document.querySelector('#feedbackForm').addEventListener('submit', async (event) => {
  event.preventDefault()
  const submitButton = document.querySelector('#feedbackSubmit')
  const error = document.querySelector('#feedbackError')
  const rating = new FormData(event.currentTarget).get('rating')
  const comment = document.querySelector('#feedbackComment').value.trim()
  error.textContent = ''
  if (!rating) { error.textContent = 'Choisissez une note entre 1 et 5 étoiles.'; return }
  submitButton.disabled = true
  submitButton.innerHTML = '<i class="ri-loader-4-line"></i> Publication...'
  try {
    const response = await fetch(`${API_ROOT}/cyberambassador/cybercomp/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: state.profile.email, rating, comment }) })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Votre commentaire n’a pas pu être publié.')
    state.profile.feedbackSubmitted = true
    document.querySelector('#feedbackDialog').close()
  } catch (feedbackError) {
    error.textContent = feedbackError instanceof TypeError ? 'Le service est momentanément indisponible.' : feedbackError.message
  } finally {
    submitButton.disabled = false
    submitButton.innerHTML = 'Publier mon commentaire <i class="ri-send-plane-line"></i>'
  }
})
