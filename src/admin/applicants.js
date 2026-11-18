// Applicant and community views ported from the previous admin console.
// Card renderers are kept as HTML strings (all values pass through escapeHtml).
import { escapeHtml } from './ui.js'

// Mirrors public/cyberambassador/challenge/challenge.js `questions` so admin can show each selected answer's full text.
export const cybercompQuestions = [
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

// `actionButtons` is injected by the resources view (status buttons + delete).
let actionButtons = () => ''
export function setActionButtons(fn) { actionButtons = fn }

function applicantField(label, value, wide = false) {
  return `<div class="${wide ? 'applicant-answer' : 'applicant-field'}"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(value || '—')}</p></div>`
}

function applicationValueLabel(value) {
  return ({
    Female: 'Femme', Male: 'Homme', 'Prefer not to say': 'Préfère ne pas répondre', Other: 'Autre',
    'Secondary school student': 'Élève du secondaire', 'University student': 'Étudiant(e)',
    Employed: 'Employé(e)', 'Self-employed': 'Travailleur indépendant',
    'Not currently studying or employed': 'Sans emploi ni études actuellement',
    Primary: 'Primaire', 'Lower secondary': 'Premier cycle du secondaire',
    'Upper secondary': 'Second cycle du secondaire', 'Technical / vocational': 'Technique / professionnel',
    'University undergraduate': 'Études universitaires en cours', 'University graduate': 'Diplômé(e) de l’université',
    Laptop: 'Ordinateur portable', Tablet: 'Tablette', Desktop: 'Ordinateur de bureau',
    Stable: 'Stable', Moderate: 'Moyen', Limited: 'Limité',
    'Understanding how the digital world works': 'Comprendre le fonctionnement du monde numérique',
    'Protecting yourself online': 'Se protéger en ligne',
    'Learning practical digital skills': 'Acquérir des compétences numériques pratiques',
    'Becoming a digital leader': 'Devenir un leader numérique',
    'Helping your community': 'Aider sa communauté',
    'Meeting other young people': 'Rencontrer d’autres jeunes',
    'In person (Yaounde)': 'En présentiel à Yaoundé', Online: 'En ligne',
    'Not sure yet': 'Ne sait pas encore',
  })[value] || value
}

function applicationStatusLabel(status) {
  return ({
    new: 'Nouvelle',
    reviewing: 'En cours d’examen',
    shortlisted: 'Présélectionnée',
    accepted: 'Acceptée',
    declined: 'Refusée',
    rejected: 'Rejetée',
  })[status] || status || 'Nouvelle'
}

function cybercompLevel(total) {
  if (total == null) return '—'
  if (total <= 36) return 'Fondation'
  if (total <= 52) return 'Intermédiaire'
  if (total <= 68) return 'Avancé'
  return 'Hautement spécialisé'
}

function inscriptionCard(item) {
  const location = [item.city, item.region, item.country].filter(Boolean).join(', ')
  const education = [applicationValueLabel(item.currentOccupation), item.school, item.fieldOfStudy, applicationValueLabel(item.highestEducation)].filter(Boolean).join(' / ')
  const access = [applicationValueLabel(item.mainDevice), `Internet : ${applicationValueLabel(item.internetAccess) || 'non précisé'}`].filter(Boolean).join(' / ')
  const company = [item.selectedCompany, item.otherCompany].filter(Boolean).join(' — ')
  const submitted = item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : 'Date inconnue'
  const cybercomp = item.cybercomp || {}
  // Prefer the phase history, then support the dual-score and legacy
  // fields used by records created before this change.
  const phaseResult = (phase) => (cybercomp.results || []).filter((result) => result.phase === phase).at(-1)
  const initialResult = phaseResult('Initiale')
  const finalResult = phaseResult('Finale')
  const initialScore = initialResult?.total ?? cybercomp.initialTotal ?? (cybercomp.initialTaken && cybercomp.phase === 'Initiale' ? cybercomp.total : null)
  const finalScore = finalResult?.total ?? cybercomp.finalTotal ?? (cybercomp.finalTaken || cybercomp.phase === 'Finale' ? cybercomp.total : null)
  const initialMax = initialResult?.max || cybercomp.initialMax || (cybercomp.phase === 'Initiale' ? (cybercomp.answers || []).length * 4 : 0) || 84
  const finalMax = finalResult?.max || cybercomp.finalMax || (cybercomp.phase === 'Finale' ? (cybercomp.answers || []).length * 4 : 0) || 84
  const scoreSummary = `Initiale : ${initialScore == null ? '—' : `${initialScore} / ${initialMax} · ${cybercompLevel(initialScore)}`} · Finale : ${finalScore == null ? '—' : `${finalScore} / ${finalMax} · ${cybercompLevel(finalScore)}`}`

  return `<article class="applicant-card" data-applicant-name="${escapeHtml(item.fullName || '')}">
    <details>
      <summary>
        <div>
          <h3>${escapeHtml(item.fullName)}${item.isTestAccount ? ' <small class="cybercomp-badge">Compte test</small>' : ''}</h3>
          <p>${escapeHtml(item.email)} · ${escapeHtml(location)}</p>
        </div>
        <div><span class="status">${escapeHtml(applicationStatusLabel(item.status))}</span><br><small>${escapeHtml(submitted)}</small></div>
      </summary>
      <div class="applicant-details">
        ${applicantField('Téléphone', item.phone)}
        ${applicantField('Âge / Date de naissance', `${item.age || '—'} / ${item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('fr-FR') : '—'}`)}
        ${applicantField('Genre', applicationValueLabel(item.gender))}
        ${applicantField('Localisation', location)}
        ${applicantField('Éducation', education)}
        ${applicantField('Accès numérique', access)}
        ${applicantField('Pourquoi devenir CyberAmbassadeur ?', item.motivation, true)}
        ${applicantField('Centres d’intérêt', [...(item.interests || []).map(applicationValueLabel), item.otherInterest].filter(Boolean).join(', '), true)}
        ${applicantField('Contribution communautaire', item.communityExperience, true)}
        ${applicantField('Question sur le numérique', item.digitalQuestion, true)}
        ${applicantField('Entreprise choisie', company)}
        ${applicantField('Participation à la cérémonie', applicationValueLabel(item.graduationAttendance))}
        ${applicantField('Pourquoi cette entreprise ?', item.companyReason, true)}
        ${applicantField('Motivation face aux difficultés', item.challengeMotivation, true)}
        ${applicantField('Pourquoi sélectionner cette personne ?', item.selectionReason, true)}
        ${applicantField('Scores CyberComp', scoreSummary)}
      </div>
    </details>
    <div class="row">${item.cybercomp?.taken ? `<button class="cybercomp-badge" type="button" onclick="showCybercompResult('${item._id}')">✓ CyberComp effectué · ${item.cybercomp.total}/${(item.cybercomp.answers || []).length * 4 || 84}</button>` : ''}${actionButtons(item._id)}</div>
  </article>`
}

function scholarshipCard(item) {
  const submitted = item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : 'Date inconnue'
  const birthDate = item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('fr-FR') : '—'
  const location = [item.city, item.country].filter(Boolean).join(', ') || 'Pays non renseigné'
  const cybercomp = item.cybercomp || {}
  const initialResult = (cybercomp.results || []).filter((result) => result.phase === 'Initiale').at(-1)
  const finalResult = (cybercomp.results || []).filter((result) => result.phase === 'Finale').at(-1)
  const initialScore = initialResult?.total ?? cybercomp.initialTotal ?? (cybercomp.initialTaken && cybercomp.phase === 'Initiale' ? cybercomp.total : null)
  const finalScore = finalResult?.total ?? cybercomp.finalTotal ?? (cybercomp.finalTaken || cybercomp.phase === 'Finale' ? cybercomp.total : null)
  const initialMax = initialResult?.max || cybercomp.initialMax || 84
  const finalMax = finalResult?.max || cybercomp.finalMax || 84
  const challengeStatus = cybercomp.initialTaken || cybercomp.finalTaken || cybercomp.taken
    ? `Initiale : ${initialScore == null ? 'effectuée' : `${initialScore} / ${initialMax} · ${cybercompLevel(initialScore)}`} · Finale : ${finalScore == null ? 'non effectuée' : `${finalScore} / ${finalMax} · ${cybercompLevel(finalScore)}`}`
    : 'Pas encore passé'
  const lastChallengeDate = cybercomp.takenAt ? new Date(cybercomp.takenAt).toLocaleString('fr-FR') : '—'
  const feedbackStatus = cybercomp.feedback?.submittedAt ? `Oui · ${new Date(cybercomp.feedback.submittedAt).toLocaleString('fr-FR')}` : 'Non'
  return `<article class="applicant-card" data-applicant-name="${escapeHtml(item.fullName || '')}">
    <details>
      <summary>
        <div><h3>${escapeHtml(item.fullName || 'Candidat·e sans nom')}</h3><p>${escapeHtml(item.email || '—')} · ${escapeHtml(location)}</p></div>
        <div><span class="status">${escapeHtml(applicationStatusLabel(item.status))}</span><br><small>${escapeHtml(submitted)}</small></div>
      </summary>
      <div class="applicant-details">
        ${applicantField('Téléphone / WhatsApp', item.phone)}
        ${applicantField('Âge / Date de naissance', `${item.age || '—'} / ${birthDate}`)}
        ${applicantField('Pays', item.country || 'Non renseigné')}
        ${applicantField('Ville / localité', item.city)}
        ${applicantField('Situation actuelle', item.currentSituation)}
        ${applicantField('Appareil d’apprentissage', item.device)}
        ${applicantField('Accès à Internet', item.internetAccess)}
        ${applicantField('Obstacle d’accès', item.accessBarrier)}
        ${applicantField('Disponibilité', item.availability, true)}
        ${applicantField('Horaires d’apprentissage', item.preferredSchedule)}
        ${applicantField('Date de début souhaitée', item.startAvailability)}
        ${applicantField('Pourquoi cette bourse ?', item.need, true)}
        ${applicantField('Déclarations', item.declarations ? `Réponses exactes : ${item.declarations.accurate ? 'oui' : 'non'} · Engagement : ${item.declarations.twoWeekCommitment ? 'oui' : 'non'} · Contact : ${item.declarations.consentToContact ? 'oui' : 'non'}` : '—', true)}
        ${applicantField('Statut CyberComp', challengeStatus)}
        ${applicantField('Dernier passage CyberComp', lastChallengeDate)}
        ${applicantField('Feedback CyberComp', feedbackStatus)}
      </div>
    </details>
    <div class="row">${cybercomp.taken ? `<button class="cybercomp-badge" type="button" onclick="showCybercompResult('${item._id}')">Voir le détail CyberComp · ${cybercomp.total}/${(cybercomp.answers || []).length * 4 || 84}</button>` : ''}${actionButtons(item._id)}</div>
  </article>`
}

function guardianVoiceCard(item) {
  const submitted = item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : 'Date inconnue'
  const location = [item.city, item.country].filter(Boolean).join(', ')
  const occupation = [item.occupation, item.otherOccupation].filter(Boolean).join(' — ')
  return `<article class="applicant-card" data-applicant-name="${escapeHtml(item.fullName || '')}">
    <details>
      <summary><div><h3>${escapeHtml(item.fullName || 'Candidat·e sans nom')}</h3><p>${escapeHtml(item.email || '—')} · ${escapeHtml(location)}</p></div><div><span class="status">${escapeHtml(applicationStatusLabel(item.status))}</span><br><small>${escapeHtml(submitted)}</small></div></summary>
      <div class="applicant-details">
        ${applicantField('WhatsApp', item.whatsapp)}${applicantField('Âge / Genre', `${item.age || '—'} / ${item.gender || '—'}`)}${applicantField('Occupation', occupation)}
        ${applicantField('Plateformes', (item.platforms || []).join(', '))}${applicantField('Profils sociaux', (item.socialProfiles || []).join(', '), true)}
        ${applicantField('A déjà créé du contenu', item.hasCreatedContent ? 'Oui' : 'Non')}${applicantField('Exemple de contenu', item.contentExample, true)}
        ${applicantField('Enjeu numérique', [item.digitalIssue, item.otherDigitalIssue].filter(Boolean).join(' — '))}${applicantField('Temps quotidien disponible', item.dailyTime)}
        ${applicantField('Accès à l’équipement', item.hasEquipmentAccess ? 'Oui' : 'Non')}${applicantField('Motivation', item.motivation, true)}${applicantField('Réponse 30 secondes', item.challengeAnswer, true)}
        ${applicantField('Engagement', `${item.trainingCommitment ? 'Formation : oui' : 'Formation : non'} · ${item.publishingCommitment ? 'Publication : oui' : 'Publication : non'}`)}
      </div>
    </details><div class="row">${actionButtons(item._id)}</div>
  </article>`
}

export const cardRenderers = { inscriptions: inscriptionCard, scholarships: scholarshipCard, 'guardians-voice-applications': guardianVoiceCard }

export function showCybercompResultFor(loadedApplicants, id) {
  const item = loadedApplicants.find((applicant) => applicant._id === id)
  if (!item?.cybercomp?.taken) return
  const result = { ...item.cybercomp, level: cybercompLevel(item.cybercomp.total) }
  const dialog = document.querySelector('#cybercompDialog')
  const maximum = (result.answers || []).length * 4 || 84
  const answerRows = (result.answers || []).map((answer, index) => {
    const question = cybercompQuestions[index]
    if (!question) return ''
    const selectedText = question[3][answer - 1] || 'Réponse inconnue'
    return `<div class="applicant-answer"><strong>Compétence ${escapeHtml(question[1])} · ${escapeHtml(question[2])}</strong><p>${escapeHtml(selectedText)} <span class="cybercomp-answer-level">(${answer}/4)</span></p></div>`
  }).join('')
  document.querySelector('#cybercompModalContent').innerHTML = `<header><div><strong>Résultat CyberComp</strong><div>${escapeHtml(item.fullName)}</div></div><button class="modal-close" type="button" onclick="document.querySelector('#cybercompDialog').close()">Fermer</button></header><h2>${escapeHtml(result.level)} · ${escapeHtml(result.total)} / ${maximum}</h2><p>${escapeHtml(result.phase || 'Initiale')} · ${result.takenAt ? escapeHtml(new Date(result.takenAt).toLocaleString('fr-FR')) : 'Date inconnue'}</p><table><thead><tr><th>Domaine</th><th>Score</th><th>Pourcentage</th></tr></thead><tbody>${(result.domains || []).map((domain) => `<tr><td>${escapeHtml(domain.name)}</td><td>${escapeHtml(domain.score)} / ${escapeHtml(domain.max)}</td><td>${domain.max ? Math.round(domain.score / domain.max * 100) : 0} %</td></tr>`).join('')}</tbody></table><h3>Détail des ${(result.answers || []).length} réponses</h3><div class="applicant-details">${answerRows}</div>`
  dialog.showModal()
}
