// Admin card for membership applications: full answers, private CV download and evaluation.
import { API, auth } from './api.js'
import { escapeHtml } from './ui.js'

const DEPARTMENTS = { communication: 'Communication', administration: 'Administration, finances & partenariats', training: 'Formation & mentorat', technology: 'Technologie & innovation open source', leadership: 'Leadership, plaidoyer & service civique' }
const VALUES = {
  active: 'Membre actif', supporting: 'Membre sympathisant',
  female: 'Femme', male: 'Homme', other: 'Autre', undisclosed: 'Préfère ne pas répondre',
  secondary: 'Secondaire', university: 'Étudiant·e', employed: 'Salarié·e', 'self-employed': 'Indépendant·e / entrepreneur·e', 'job-seeking': 'En recherche d’emploi',
  baccalaureate: 'Baccalauréat', vocational: 'Technique / professionnel', bachelor: 'Licence', master: 'Master', doctorate: 'Doctorat',
  single: 'En une fois', instalments: 'En plusieurs tranches', discuss: 'Souhaite en discuter',
  video: 'Appel vidéo', phone: 'Téléphone', 'in-person': 'En présentiel',
}
const STATUS = { new: 'Nouvelle', reviewing: 'En examen', shortlisted: 'Présélectionnée', interview: 'Entretien', accepted: 'Acceptée', declined: 'Refusée' }
const label = (value) => VALUES[value] || value || '—'
const field = (name, value, wide = false) => `<div class="${wide ? 'applicant-answer' : 'applicant-field'}"><strong>${escapeHtml(name)}</strong><p>${escapeHtml(value || '—')}</p></div>`
const age = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const years = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000))
  return `${d.toLocaleDateString('fr-FR')} (${years} ans)`
}
const toLocal = (value) => {
  if (!value) return ''
  const d = new Date(value)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
const stars = (score) => (score ? `<span class="ms-stars" title="${score}/5">${'★'.repeat(score)}${'☆'.repeat(5 - score)}</span>` : '')

export const MEMBERSHIP_ACTIONS = [['Examiner', 'reviewing'], ['Présélectionner', 'shortlisted'], ['Inviter en entretien', 'interview'], ['Accepter', 'accepted'], ['Refuser', 'declined']]
export const MEMBERSHIP_FILTERS = [['all', 'Toutes'], ['new', 'Nouvelles'], ['reviewing', 'En examen'], ['shortlisted', 'Présélectionnées'], ['interview', 'Entretien'], ['accepted', 'Acceptées'], ['declined', 'Refusées']]

export function membershipCard(item, actionButtons) {
  const submitted = item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : ''
  const place = [item.city, item.region, item.country].filter(Boolean).join(', ')
  const review = item.review || {}
  const cv = item.hasCv || item.cv?.name
    ? `<button class="btn small" type="button" onclick="downloadCv('${item._id}')">📄 Télécharger le CV (${escapeHtml(item.cv?.name || 'CV')})</button>`
    : '<span class="muted">Aucun CV joint</span>'
  const profile = item.profileUrl && /^https?:\/\//.test(item.profileUrl) ? `<a href="${escapeHtml(item.profileUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.profileUrl)}</a>` : '—'
  return `<article class="applicant-card membership-card" data-applicant-name="${escapeHtml(item.fullName)}">
    <details>
      <summary>
        <div><h3>${escapeHtml(item.fullName)} ${stars(review.score)}</h3><p>${escapeHtml(item.email)} · ${escapeHtml(place)}</p>
          <p class="tags"><span class="badge tone-info">${escapeHtml(label(item.memberType))}</span>${(item.departments || []).map((d) => `<span class="badge tone-neutral">${escapeHtml(DEPARTMENTS[d] || d)}</span>`).join('')}${item.hasCv ? '<span class="badge tone-success">CV</span>' : ''}</p></div>
        <div><span class="status">${escapeHtml(STATUS[item.status] || item.status)}</span><br><small>${escapeHtml(submitted)}</small></div>
      </summary>
      <div class="applicant-details">
        <h4 class="span">À propos</h4>
        ${field('Téléphone / WhatsApp', item.phone)}${field('Date de naissance', age(item.dateOfBirth))}
        ${field('Genre', label(item.gender))}${field('Localisation', place)}
        <h4 class="span">Parcours & compétences</h4>
        ${field('Situation actuelle', label(item.occupation))}${field('Niveau d’études', label(item.educationLevel))}
        ${field('Établissement / organisation', item.organization)}${field('Domaine d’études / métier', item.fieldOfStudy)}
        ${field('Compétences', (item.skills || []).join(', '), true)}
        ${field('Autres compétences', item.otherSkills)}${field('Langues', (item.languages || []).join(', '))}
        <div class="applicant-field"><strong>Profil en ligne</strong><p>${profile}</p></div>
        <div class="applicant-field"><strong>CV</strong><p>${cv}</p></div>
        <h4 class="span">Engagement</h4>
        ${field('Type d’adhésion', label(item.memberType))}${field('Départements', (item.departments || []).map((d) => DEPARTMENTS[d] || d).join(', '))}
        ${field('Disponibilité', item.availability)}${field('Participation', item.participationMode)}
        ${field('Comment nous a connus', item.referralSource)}
        <h4 class="span">Motivation & expérience</h4>
        ${field('Pourquoi devenir membre ?', item.motivation, true)}
        ${field('Expérience pertinente', item.experience, true)}
        ${field('Ce qu’il/elle apporterait', item.contribution, true)}
        ${field('Attentes', item.expectations, true)}
        ${field('Personne de référence', item.referee, true)}
        <h4 class="span">Cotisation & entretien</h4>
        ${field('Paiement de la cotisation', label(item.paymentPlan))}${field('Format d’entretien préféré', label(item.interviewMode))}
        ${field('Engagements', item.commitments && Object.values(item.commitments).every(Boolean) ? 'Tous acceptés (statuts, protection des jeunes, cotisation, exactitude, données)' : 'Incomplets', true)}
      </div>
      <form class="review-box" onsubmit="event.preventDefault(); saveReview('${item._id}', this)">
        <h4>Évaluation interne</h4>
        <div class="review-grid">
          <label class="field"><span class="field-label">Note</span><select name="score">${[0, 1, 2, 3, 4, 5].map((n) => `<option value="${n}"${Number(review.score || 0) === n ? ' selected' : ''}>${n ? `${n}/5 ${'★'.repeat(n)}` : 'Non notée'}</option>`).join('')}</select></label>
          <label class="field"><span class="field-label">Date d’entretien</span><input type="datetime-local" name="interviewAt" value="${toLocal(review.interviewAt)}"></label>
        </div>
        <label class="field"><span class="field-label">Notes (visibles uniquement par l’équipe)</span><textarea name="notes" rows="3">${escapeHtml(review.notes || '')}</textarea></label>
        <button class="btn small primary" type="submit">Enregistrer l’évaluation</button>
      </form>
    </details>
    <div class="row">${actionButtons(item._id)}</div>
  </article>`
}

export async function downloadCv(id) {
  const response = await fetch(`${API}/admin/membership-applications/${id}/cv`, { headers: { Authorization: `Bearer ${auth.token}` } })
  if (!response.ok) throw new Error('Could not download the CV.')
  const blob = await response.blob()
  const disposition = response.headers.get('content-disposition') || ''
  const name = decodeURIComponent((disposition.match(/filename="([^"]+)"/) || [])[1] || 'cv')
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
