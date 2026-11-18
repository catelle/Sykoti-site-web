import express from 'express'
import multer from 'multer'
import Article from '../models/Article.js'
import CyberambassadorInscription from '../models/CyberambassadorInscription.js'
import Report from '../models/Report.js'
import Support from '../models/Support.js'
import Webinar from '../models/Webinar.js'
import Engagement, { ENGAGEMENT_AGE_RANGES, ENGAGEMENT_THEMES } from '../models/Engagement.js'
import ScholarshipApplication from '../models/ScholarshipApplication.js'
import GuardianVoiceApplication from '../models/GuardianVoiceApplication.js'
import M1Evaluation from '../models/M1Evaluation.js'
import CyberambassadorContent from '../models/CyberambassadorContent.js'
import Program from '../models/Program.js'
import ProgramCohort from '../models/ProgramCohort.js'
import ProgramActivity from '../models/ProgramActivity.js'
import TeamMember from '../models/TeamMember.js'
import ContactMessage from '../models/ContactMessage.js'
import SiteContent from '../models/SiteContent.js'
import MembershipApplication from '../models/MembershipApplication.js'

const router = express.Router()
const upload = multer({ dest: 'server/uploads/' })
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
const CYBERAMBASSADOR_APPLICATIONS_OPEN = false
const CYBERCOMP_TEST_EMAILS = new Set([
  'catelleningha@gmail.com',
  ...(process.env.CYBERCOMP_TEST_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean),
])
const engagementSubmissions = new Map()
const guardianVoiceSubmissions = new Map()
const m1EvaluationSubmissions = new Map()
const supportSubmissions = new Map()
const membershipSubmissions = new Map()
const MEMBERSHIP_COHORT = String(new Date().getFullYear())
const CV_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1, fields: 5, fieldSize: 64 * 1024 },
  fileFilter(_req, file, callback) {
    if (CV_TYPES.includes(file.mimetype)) return callback(null, true)
    const error = new Error('CV: PDF or Word documents only.')
    error.status = 400
    return callback(error)
  },
})
const listOf = (value, max = 12) => (Array.isArray(value) ? value : []).map((item) => text(item).slice(0, 120)).filter(Boolean).slice(0, max)
const SUPPORT_TYPES = ['volunteer', 'donation', 'partnership', 'in-kind', 'other']

const GUARDIAN_VOICE_PLATFORMS = ['TikTok', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'X', 'Other']
const GUARDIAN_VOICE_OCCUPATIONS = ['Student', 'Professional', 'Entrepreneur', 'Content Creator', 'Other']
const GUARDIAN_VOICE_ISSUES = ['Online safety', 'Cyberbullying', 'Scams & fraud', 'Privacy & personal data', 'Misinformation', 'Responsible social media use', 'AI & emerging technologies', 'Other']
const GUARDIAN_VOICE_DAILY_TIME = ['Less than 30 minutes', '30–60 minutes', '1–2 hours', 'More than 2 hours']

const text = (value) => String(value || '').trim()
const wordCount = (value) => text(value).split(/\s+/).filter(Boolean).length
const isWebUrl = (value) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const isCybercompTestEmail = (email) => CYBERCOMP_TEST_EMAILS.has(email)
const assessmentPhase = (value) => value === 'Finale' ? 'Finale' : 'Initiale'
const challengeFields = [
  'fullName',
  'email',
  'cybercomp.taken',
  'cybercomp.initialTaken',
  'cybercomp.finalTaken',
  'cybercomp.initialTotal',
  'cybercomp.finalTotal',
  'cybercomp.initialMax',
  'cybercomp.finalMax',
  'cybercomp.takenAt',
  'cybercomp.phase',
  'cybercomp.total',
  'cybercomp.answers',
  'cybercomp.feedback.submittedAt',
].join(' ')

async function findCybercompApplicant(email) {
  const cyberambassador = await CyberambassadorInscription.findOne({ email, cohort: 'pilot-2026' }).select(challengeFields)
  if (cyberambassador) return { applicant: cyberambassador, model: CyberambassadorInscription, cohort: 'pilot-2026' }

  const scholarship = await ScholarshipApplication.findOne({ email, cohort: 'scholarship-2026' }).select(challengeFields)
  if (scholarship) return { applicant: scholarship, model: ScholarshipApplication, cohort: 'scholarship-2026' }

  return null
}

// Match applicants who have not yet submitted this phase. The phase fallback
// keeps records created before the independent phase flags from being repeated.
const phaseAvailableQuery = (phase) => {
  const field = phase === 'Finale' ? 'finalTaken' : 'initialTaken'
  return { $nor: [{ [`cybercomp.${field}`]: true }, { 'cybercomp.taken': true, 'cybercomp.phase': phase }] }
}

async function preserveLegacyPhaseResult({ applicant, model }) {
  const cybercomp = applicant.cybercomp
  if (!cybercomp?.taken || !['Initiale', 'Finale'].includes(cybercomp.phase) || !Number.isFinite(cybercomp.total)) return

  const prefix = cybercomp.phase === 'Finale' ? 'final' : 'initial'
  if (cybercomp[`${prefix}Total`] != null) return

  await model.updateOne(
    { _id: applicant._id, [`cybercomp.${prefix}Total`]: { $exists: false } },
    { $set: {
      [`cybercomp.${prefix}Taken`]: true,
      [`cybercomp.${prefix}Total`]: cybercomp.total,
      [`cybercomp.${prefix}Max`]: (cybercomp.answers || []).length * 4 || 84,
    } }
  )
}

async function ensureCybercompTestApplicant(email) {
  const existing = await CyberambassadorInscription.findOne({ email, cohort: 'pilot-2026' })
  if (existing) return existing

  return CyberambassadorInscription.create({
    fullName: 'CyberComp test account',
    email,
    dateOfBirth: new Date('2008-01-01T00:00:00.000Z'),
    age: 18,
    phone: 'Test account',
    country: 'Test',
    region: 'Test',
    city: 'Test',
    currentOccupation: 'Test account',
    school: 'Test account',
    fieldOfStudy: 'CyberComp testing',
    highestEducation: 'University graduate',
    mainDevice: 'Laptop',
    internetAccess: 'Stable',
    motivation: 'CyberComp test account.',
    interests: ['Testing'],
    communityExperience: 'CyberComp test account.',
    digitalQuestion: 'CyberComp test account.',
    selectedCompany: 'Other',
    companyReason: 'CyberComp test account.',
    challengeMotivation: 'CyberComp test account.',
    selectionReason: 'CyberComp test account.',
    graduationAttendance: 'Online',
    declarations: { accurate: true, noSelectionGuarantee: true, participationCommitment: true },
    cohort: 'pilot-2026',
    status: 'accepted',
    isTestAccount: true,
  })
}

router.post('/scholarship/applications', asyncRoute(async (req, res) => {
  const body = req.body || {}
  const birthDate = new Date(body.dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) return res.status(400).json({ message: 'A valid date of birth is required.' })
  const today = new Date()
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear()
  const monthDifference = today.getUTCMonth() - birthDate.getUTCMonth()
  if (monthDifference < 0 || (monthDifference === 0 && today.getUTCDate() < birthDate.getUTCDate())) age -= 1
  if (age < 15 || age > 35) return res.status(400).json({ message: 'Applicants must be between 15 and 35 years old.' })
  const declarations = body.declarations || {}
  if (!declarations.accurate || !declarations.twoWeekCommitment || !declarations.consentToContact) return res.status(400).json({ message: 'Please accept all three declarations before submitting.' })
  const email = String(body.email || '').trim().toLowerCase()
  if (await ScholarshipApplication.findOne({ email, cohort: 'scholarship-2026' })) return res.status(409).json({ message: 'An application has already been submitted with this email address.' })
  const application = await ScholarshipApplication.create({ ...body, country: String(body.country || '').trim(), email, age, dateOfBirth: birthDate, cohort: 'scholarship-2026', status: 'new' })
  res.status(201).json({ id: application._id })
}))

router.post('/m1-evaluation', asyncRoute(async (req, res) => {
  const body = req.body || {}
  if (body.website) return res.status(201).json({ received: true })

  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (m1EvaluationSubmissions.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000)
  if (recent.length >= 6) return res.status(429).json({ message: 'Trop de tentatives. Réessaie dans quelques minutes.' })
  m1EvaluationSubmissions.set(ip, [...recent, now])

  const participantCode = text(body.participantCode).toUpperCase()
  const fullName = text(body.fullName)
  const email = text(body.email).toLowerCase()
  const city = text(body.city)
  const cohort = text(body.cohort) || 'CyberA-Rise'
  const completionDate = new Date(body.completionDate)
  const newPractices = Array.isArray(body.newPractices) ? [...new Set(body.newPractices.map(text).filter(Boolean))].slice(0, 8) : []
  const newPracticeAdopted = body.newPracticeAdopted
  const voluntaryActionTaken = body.voluntaryActionTaken
  const riskActionTaken = body.riskActionTaken

  if (participantCode.length < 2 || participantCode.length > 80) return res.status(400).json({ message: 'Le code participant est requis.' })
  if (fullName.length < 2 || fullName.length > 120) return res.status(400).json({ message: 'Indique ton nom complet.' })
  if (email && (!/^\S+@\S+\.\S+$/.test(email) || email.length > 180)) return res.status(400).json({ message: 'Indique une adresse e-mail valide.' })
  if (!city || city.length > 120) return res.status(400).json({ message: 'La ville est requise.' })
  if (Number.isNaN(completionDate.getTime())) return res.status(400).json({ message: 'Indique une date de fin valide.' })
  if (![newPracticeAdopted, voluntaryActionTaken, riskActionTaken].every((value) => typeof value === 'boolean')) return res.status(400).json({ message: 'Réponds aux trois questions principales.' })
  if (newPracticeAdopted && !newPractices.length && text(body.practiceExample).length < 5) return res.status(400).json({ message: 'Décris au moins une nouvelle pratique adoptée.' })
  if (voluntaryActionTaken && text(body.voluntaryActionDetails).length < 5) return res.status(400).json({ message: 'Décris ton action comme relais volontaire.' })
  if (riskActionTaken && text(body.riskActionExample).length < 5) return res.status(400).json({ message: 'Donne un exemple de situation où tu as agi.' })

  await M1Evaluation.findOneAndUpdate(
    { participantCode, cohort },
    {
      participantCode, fullName, email, city, cohort, completionDate,
      newPracticeAdopted, newPractices, practiceExample: text(body.practiceExample),
      voluntaryActionTaken, voluntaryActionDetails: text(body.voluntaryActionDetails),
      riskActionTaken, riskActionExample: text(body.riskActionExample),
      maintenanceObstacle: text(body.maintenanceObstacle), contactConsent: body.contactConsent === true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  )
  res.status(201).json({ message: 'Merci. Ton évaluation M+1 a bien été enregistrée.' })
}))

router.post('/guardians-voice/applications', asyncRoute(async (req, res) => {
  const body = req.body || {}
  if (body.website) return res.status(201).json({ received: true })

  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (guardianVoiceSubmissions.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000)
  if (recent.length >= 4) return res.status(429).json({ message: 'Too many attempts. Please wait a few minutes and try again.' })

  const email = text(body.email).toLowerCase()
  const age = Number(body.age)
  const platforms = Array.isArray(body.platforms) ? [...new Set(body.platforms.map(text).filter(Boolean))] : []
  const socialProfiles = Array.isArray(body.socialProfiles) ? body.socialProfiles.map(text).filter(Boolean) : []
  const confirmations = body.confirmations || {}

  if (text(body.fullName).length < 2 || text(body.fullName).length > 120) return res.status(400).json({ message: 'Please enter your full name.' })
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 180) return res.status(400).json({ message: 'Please enter a valid email address.' })
  if (!/^\+[\d\s().-]{7,39}$/.test(text(body.whatsapp))) return res.status(400).json({ message: 'Enter your WhatsApp number with its country code, beginning with +.' })
  if (!Number.isInteger(age) || age < 1 || age > 120) return res.status(400).json({ message: 'Please enter a valid age.' })
  if (!text(body.country) || !text(body.city)) return res.status(400).json({ message: 'Country and city are required.' })
  if (!GUARDIAN_VOICE_OCCUPATIONS.includes(body.occupation)) return res.status(400).json({ message: 'Please select your current occupation or status.' })
  if (body.occupation === 'Other' && !text(body.otherOccupation)) return res.status(400).json({ message: 'Please specify your current occupation or status.' })
  if (platforms.some((platform) => !GUARDIAN_VOICE_PLATFORMS.includes(platform))) return res.status(400).json({ message: 'One or more selected platforms are invalid.' })
  if (socialProfiles.length > 8 || socialProfiles.some((url) => !isWebUrl(url))) return res.status(400).json({ message: 'Social profile links must be valid web addresses, one per line.' })
  if (typeof body.hasCreatedContent !== 'boolean') return res.status(400).json({ message: 'Please tell us whether you have created digital content before.' })
  if (body.contentExample && !isWebUrl(text(body.contentExample))) return res.status(400).json({ message: 'The content example must be a valid web address.' })
  if (wordCount(body.motivation) < 5 || wordCount(body.motivation) > 150) return res.status(400).json({ message: 'Your motivation must be between 5 and 150 words.' })
  if (!GUARDIAN_VOICE_ISSUES.includes(body.digitalIssue)) return res.status(400).json({ message: 'Please select a digital issue.' })
  if (body.digitalIssue === 'Other' && !text(body.otherDigitalIssue)) return res.status(400).json({ message: 'Please specify the digital issue you want to address.' })
  if ([body.trainingCommitment, body.publishingCommitment, body.hasEquipmentAccess].some((value) => typeof value !== 'boolean')) return res.status(400).json({ message: 'Please answer all three challenge commitment questions.' })
  if (!GUARDIAN_VOICE_DAILY_TIME.includes(body.dailyTime)) return res.status(400).json({ message: 'Please select the time you can dedicate each day.' })
  if (wordCount(body.challengeAnswer) < 3 || wordCount(body.challengeAnswer) > 100) return res.status(400).json({ message: 'Your 30-second answer must be between 3 and 100 words.' })
  if (confirmations.selectionAndParticipation !== true || confirmations.rewardsCriteria !== true) return res.status(400).json({ message: 'Please accept both confirmation statements.' })

  if (await GuardianVoiceApplication.exists({ email, campaign: 'guardians-voice-30-day' })) return res.status(409).json({ message: 'An application has already been submitted with this email address.' })

  try {
    const application = await GuardianVoiceApplication.create({
      fullName: text(body.fullName), email, whatsapp: text(body.whatsapp), age,
      gender: text(body.gender), country: text(body.country), city: text(body.city),
      occupation: body.occupation, otherOccupation: text(body.otherOccupation), platforms,
      socialProfiles, hasCreatedContent: body.hasCreatedContent, contentExample: text(body.contentExample),
      motivation: text(body.motivation), digitalIssue: body.digitalIssue,
      otherDigitalIssue: text(body.otherDigitalIssue), trainingCommitment: body.trainingCommitment,
      publishingCommitment: body.publishingCommitment, hasEquipmentAccess: body.hasEquipmentAccess, dailyTime: body.dailyTime,
      challengeAnswer: text(body.challengeAnswer), confirmations: { selectionAndParticipation: true, rewardsCriteria: true },
    })
    recent.push(now)
    guardianVoiceSubmissions.set(ip, recent)
    res.status(201).json({ id: application._id })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'An application has already been submitted with this email address.' })
    throw error
  }
}))

router.get('/engagements/summary', asyncRoute(async (_req, res) => {
  const [total, shared] = await Promise.all([
    Engagement.countDocuments(),
    Engagement.countDocuments({ consentToPublish: true, status: 'approved' }),
  ])
  res.json({ total, shared })
}))

router.get('/engagements/locations', asyncRoute(async (_req, res) => {
  const locations = await Engagement.distinct('location')
  res.json(locations.filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr')).slice(0, 100))
}))

router.get('/engagements/wall', asyncRoute(async (req, res) => {
  const query = { consentToPublish: true, status: 'approved' }
  if (ENGAGEMENT_THEMES.includes(req.query.theme)) query.theme = req.query.theme
  const [items, total, shared] = await Promise.all([
    Engagement.find(query).select('displayName theme commitment approvedAt').sort({ approvedAt: -1, createdAt: -1 }).limit(200).lean(),
    Engagement.countDocuments(),
    Engagement.countDocuments({ consentToPublish: true, status: 'approved' }),
  ])
  res.json({ items, total, shared })
}))

router.post('/engagements', asyncRoute(async (req, res) => {
  const body = req.body || {}
  if (body.website) return res.status(201).json({ total: await Engagement.countDocuments() })
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (engagementSubmissions.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000)
  if (recent.length >= 5) return res.status(429).json({ message: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.' })

  const location = String(body.location || '').trim()
  const commitment = String(body.commitment || '').trim()
  const phone = String(body.phone || '').trim()
  const contactConsent = body.contactConsent === true
  if (location.length < 2 || location.length > 120) return res.status(400).json({ message: 'Indiquez le lieu où nous nous sommes rencontrés.' })
  if (!ENGAGEMENT_THEMES.includes(body.theme)) return res.status(400).json({ message: 'Choisissez une thématique.' })
  if (commitment.length < 5 || commitment.length > 250) return res.status(400).json({ message: 'Votre engagement doit contenir entre 5 et 250 caractères.' })
  if (phone.length > 40) return res.status(400).json({ message: 'Le numéro de téléphone ne doit pas dépasser 40 caractères.' })
  if (contactConsent && !phone) return res.status(400).json({ message: 'Indiquez votre numéro pour accepter le contact communautaire.' })
  if (body.ageRange && !ENGAGEMENT_AGE_RANGES.includes(body.ageRange)) return res.status(400).json({ message: 'La tranche d’âge sélectionnée est invalide.' })

  const consentToPublish = body.consentToPublish === true
  await Engagement.create({
    displayName: String(body.displayName || '').trim().slice(0, 60),
    ageRange: body.ageRange || '', location, theme: body.theme, commitment,
    phone: contactConsent ? phone : '', contactConsent,
    consentToPublish, status: consentToPublish ? 'pending' : 'private',
  })
  recent.push(now)
  engagementSubmissions.set(ip, recent)
  res.status(201).json({ total: await Engagement.countDocuments() })
}))

router.post('/cyberambassador/cybercomp/access', asyncRoute(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const phase = assessmentPhase(req.body?.phase)
  const match = isCybercompTestEmail(email)
    ? { applicant: await ensureCybercompTestApplicant(email), model: CyberambassadorInscription, cohort: 'pilot-2026' }
    : await findCybercompApplicant(email)
  if (!match) return res.status(404).json({ message: 'Cette adresse e-mail ne correspond pas à une candidature CyberAmbassador ou Scholarship.' })
  const { applicant } = match
  const alreadyTaken = phase === 'Finale'
    ? applicant.cybercomp?.finalTaken === true || (applicant.cybercomp?.taken === true && applicant.cybercomp?.phase === 'Finale')
    : applicant.cybercomp?.initialTaken === true || (applicant.cybercomp?.taken === true && applicant.cybercomp?.phase === 'Initiale')
  // Explicit test accounts are intentionally reusable so both phases can be
  // exercised repeatedly during QA. Real applicants remain one-attempt-per-phase.
  if (alreadyTaken && !isCybercompTestEmail(email)) return res.status(409).json({ message: `Vous avez déjà passé l’évaluation ${phase}.` })

  // Preserve whichever legacy score exists before the other phase replaces
  // the shared compatibility fields (`phase`, `total`, and `answers`).
  await preserveLegacyPhaseResult(match)

  res.json({ applicant: { fullName: applicant.fullName, email: applicant.email, cybercompTaken: Boolean(applicant.cybercomp?.taken), feedbackSubmitted: Boolean(applicant.cybercomp?.feedback?.submittedAt) } })
}))

router.get('/cyberambassador/cybercomp/feedback', asyncRoute(async (_req, res) => {
  const [cyberambassadors, scholars] = await Promise.all([
    CyberambassadorInscription.find({
      'cybercomp.taken': true,
      'cybercomp.feedback.comment': { $exists: true, $ne: '' },
    }).select('fullName cybercomp.feedback').lean(),
    ScholarshipApplication.find({
      'cybercomp.taken': true,
      'cybercomp.feedback.comment': { $exists: true, $ne: '' },
    }).select('fullName cybercomp.feedback').lean(),
  ])
  const applicants = [...cyberambassadors, ...scholars]
    .sort((a, b) => new Date(b.cybercomp.feedback.submittedAt) - new Date(a.cybercomp.feedback.submittedAt))
    .slice(0, 30)

  res.json(applicants.map((applicant) => ({
    name: applicant.fullName,
    comment: applicant.cybercomp.feedback.comment,
    rating: applicant.cybercomp.feedback.rating,
    submittedAt: applicant.cybercomp.feedback.submittedAt,
  })))
}))

router.post('/cyberambassador/cybercomp/feedback', asyncRoute(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const comment = String(req.body?.comment || '').trim()
  const rating = Number(req.body?.rating)
  if (comment.length < 5 || comment.length > 700) return res.status(400).json({ message: 'Votre commentaire doit contenir entre 5 et 700 caractères.' })
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Choisissez une note entre 1 et 5.' })
  let applicant = await CyberambassadorInscription.findOneAndUpdate(
    { email, cohort: 'pilot-2026', 'cybercomp.taken': true },
    { $set: { 'cybercomp.feedback': { comment, rating, submittedAt: new Date() } } },
    { new: true, runValidators: true }
  ).select('fullName cybercomp.feedback')
  if (!applicant) {
    applicant = await ScholarshipApplication.findOneAndUpdate(
      { email, cohort: 'scholarship-2026', 'cybercomp.taken': true },
      { $set: { 'cybercomp.feedback': { comment, rating, submittedAt: new Date() } } },
      { new: true, runValidators: true }
    ).select('fullName cybercomp.feedback')
  }
  if (!applicant) return res.status(404).json({ message: 'Terminez le challenge CyberComp avant de laisser un commentaire.' })
  res.status(201).json({ feedback: applicant.cybercomp.feedback })
}))

router.post('/cyberambassador/cybercomp/results', asyncRoute(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const phase = assessmentPhase(req.body?.phase)
  const answers = Array.isArray(req.body?.answers) ? req.body.answers.map(Number) : []
  const supportedQuestionCounts = [21, 26]
  if (!supportedQuestionCounts.includes(answers.length) || answers.some((answer) => !Number.isInteger(answer) || answer < 1 || answer > 4)) {
    return res.status(400).json({ message: 'Toutes les réponses CyberComp sont requises.' })
  }

  const total = answers.reduce((sum, answer) => sum + answer, 0)
  const expectedLevel = total <= 36
    ? 'Fondation'
    : total <= 52
      ? 'Intermédiaire'
      : total <= 68
        ? 'Avancé'
        : 'Hautement spécialisé'
  const domains = Array.isArray(req.body?.domains) ? req.body.domains : []
  if (domains.length !== 5) return res.status(400).json({ message: 'Les résultats des cinq domaines sont requis.' })
  const existingMatch = await findCybercompApplicant(email)
  if (existingMatch) await preserveLegacyPhaseResult(existingMatch)
  const availabilityQuery = isCybercompTestEmail(email) ? {} : phaseAvailableQuery(phase)
  const resultFields = {
    'cybercomp.taken': true,
    [`cybercomp.${phase === 'Finale' ? 'finalTaken' : 'initialTaken'}`]: true,
    [`cybercomp.${phase === 'Finale' ? 'finalTotal' : 'initialTotal'}`]: total,
    [`cybercomp.${phase === 'Finale' ? 'finalMax' : 'initialMax'}`]: answers.length * 4,
    'cybercomp.takenAt': new Date(),
    'cybercomp.phase': phase,
    'cybercomp.total': total,
    'cybercomp.level': expectedLevel,
    'cybercomp.answers': answers,
    'cybercomp.domains': domains.map((domain) => ({ name: String(domain.name || ''), score: Number(domain.score), max: Number(domain.max) })),
  }
  let applicant = await CyberambassadorInscription.findOneAndUpdate(
    { email, cohort: 'pilot-2026', ...availabilityQuery },
    {
      $set: resultFields,
      // Keep an audit-friendly record for each phase. This also prevents a
      // later assessment from hiding the score that was submitted earlier.
      $push: { 'cybercomp.results': { phase, total, max: answers.length * 4, takenAt: new Date() } },
    },
    { new: true, runValidators: true }
  ).select('fullName email cybercomp')

  if (!applicant) {
    applicant = await ScholarshipApplication.findOneAndUpdate(
      { email, cohort: 'scholarship-2026', ...availabilityQuery },
      { $set: resultFields, $push: { 'cybercomp.results': { phase, total, max: answers.length * 4, takenAt: new Date() } } },
      { new: true, runValidators: true }
    ).select('fullName email cybercomp')
  }

  if (!applicant) {
    const exists = await CyberambassadorInscription.exists({ email, cohort: 'pilot-2026' })
      || await ScholarshipApplication.exists({ email, cohort: 'scholarship-2026' })
    return res.status(exists ? 409 : 404).json({ message: exists ? `Vous avez déjà passé l’évaluation ${phase}.` : 'Cette adresse e-mail ne correspond pas à une candidature CyberAmbassador ou Scholarship.' })
  }
  res.json({ applicant })
}))

router.get('/site-content', asyncRoute(async (_req, res) => {
  const docs = await SiteContent.find({}, { page: 1, shared: 1, en: 1, fr: 1, updatedAt: 1 }).lean()
  res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300')
  res.json({ pages: Object.fromEntries(docs.map(({ page, shared, en, fr, updatedAt }) => [page, { shared, en, fr, updatedAt }])) })
}))

router.get('/reports', asyncRoute(async (_req, res) => {
  const reports = await Report.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 })
  res.json(reports)
}))

router.get('/cyberambassador/content', asyncRoute(async (_req, res) => {
  const content = await CyberambassadorContent.findOne({ slug: 'public', status: 'published' }).lean()
  if (!content) return res.json({ media: [], testimonials: [] })
  res.json({
    media: (content.media || []).filter((item) => item.url && item.alt).sort((a, b) => a.sortOrder - b.sortOrder),
    testimonials: (content.testimonials || []).filter((item) => item.status === 'published' && item.publicationConsent).sort((a, b) => a.sortOrder - b.sortOrder),
  })
}))

router.get('/cyberambassador/impact', asyncRoute(async (_req, res) => {
  const [cyberCountries, cyberFields, scholarshipCountries, scholarshipSituations, scholarshipApplicationCountries] = await Promise.all([
    CyberambassadorInscription.aggregate([{ $match: { cohort: 'pilot-2026', status: { $in: ['shortlisted', 'accepted'] }, isTestAccount: { $ne: true }, country: { $nin: ['', null] } } }, { $group: { _id: '$country', count: { $sum: 1 } } }]),
    CyberambassadorInscription.aggregate([{ $match: { cohort: 'pilot-2026', status: { $in: ['shortlisted', 'accepted'] }, isTestAccount: { $ne: true }, fieldOfStudy: { $nin: ['', null] } } }, { $group: { _id: '$fieldOfStudy', count: { $sum: 1 } } }]),
    ScholarshipApplication.aggregate([{ $match: { cohort: 'scholarship-2026', status: 'accepted', country: { $nin: ['', null] } } }, { $group: { _id: '$country', count: { $sum: 1 } } }]),
    ScholarshipApplication.aggregate([{ $match: { cohort: 'scholarship-2026', status: 'accepted', currentSituation: { $nin: ['', null] } } }, { $group: { _id: '$currentSituation', count: { $sum: 1 } } }]),
    ScholarshipApplication.aggregate([{ $match: { cohort: 'scholarship-2026', country: { $nin: ['', null] } } }, { $group: { _id: '$country', count: { $sum: 1 } } }]),
  ])
  const normalizeCountry = (value) => {
    const key = String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
    if (['cameroun', 'cameroon'].includes(key)) return 'Cameroun'
    if (key.includes('congo') || key === 'rdc') return 'RDC'
    if (key.includes("cote d'ivoire") || key.includes('cote divoire')) return "Côte d’Ivoire"
    if (key === 'senegal') return 'Sénégal'
    if (key === 'burkina faso') return 'Burkina Faso'
    if (key === 'benin') return 'Bénin'
    if (key === 'guinee') return 'Guinée'
    if (key === 'togo') return 'Togo'
    return String(value || 'Pays non renseigné')
  }
  const normalizeStudy = (value) => {
    const key = String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (key.includes('informat') || key.includes('cyber') || key.includes('genie logiciel') || key.includes('genie informatique') || key.includes('reseaux')) return 'Numérique, informatique & cybersécurité'
    if (key.includes('biolog') || key.includes('biochim') || key.includes('medec') || key.includes('science')) return 'Sciences & santé'
    if (key.includes('droit') || key.includes('psycholog') || key.includes('polit') || key.includes('education') || key.includes('langue') || key.includes('econom') || key.includes('lettres') || key.includes('management')) return 'Sciences humaines, droit & éducation'
    return 'Autres / niveau d’étude non précisé'
  }
  const format = (items, normalizer = (value) => value) => Object.values(items.reduce((acc, item) => { const label = normalizer(item._id); acc[label] = { label, count: (acc[label]?.count || 0) + item.count }; return acc }, {})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr'))
  res.json({
    cyberA: { acceptedCount: await CyberambassadorInscription.countDocuments({ cohort: 'pilot-2026', status: { $in: ['shortlisted', 'accepted'] }, isTestAccount: { $ne: true } }), countries: format(cyberCountries, normalizeCountry), studyDomains: format(cyberFields, normalizeStudy) },
    scholarships: { acceptedCount: await ScholarshipApplication.countDocuments({ cohort: 'scholarship-2026', status: 'accepted' }), countries: format(scholarshipCountries, normalizeCountry), applicationCountries: format(scholarshipApplicationCountries, normalizeCountry), situations: format(scholarshipSituations) },
  })
}))

router.post('/reports', upload.single('file'), asyncRoute(async (req, res) => {
  const report = await Report.create({
    title: req.body.title,
    description: req.body.description,
    period: req.body.period,
    category: req.body.category,
    source: req.body.source || 'Community submission',
    fileName: req.file?.originalname,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl,
    coverUrl: req.body.coverUrl,
    status: 'pending',
  })

  res.status(201).json(report)
}))

router.post('/reports/:id/share', asyncRoute(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { $inc: { shareCount: 1 } }, { new: true })
  if (!report) return res.status(404).json({ message: 'Report not found' })
  res.json({ shareCount: report.shareCount })
}))

router.get('/articles', asyncRoute(async (_req, res) => {
  const articles = await Article.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 })
  res.json(articles)
}))

router.get('/articles/:slug', asyncRoute(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug, status: 'published' })
  if (!article) return res.status(404).json({ message: 'Article not found' })
  res.json(article)
}))

router.get('/programs', asyncRoute(async (_req, res) => {
  const programs = await Program.find({ status: 'published' }).sort({ sortOrder: 1, createdAt: -1 }).lean()
  res.json(programs)
}))

router.get('/programs/:slug', asyncRoute(async (req, res) => {
  const program = await Program.findOne({ slug: req.params.slug, status: 'published' }).lean()
  if (!program) return res.status(404).json({ message: 'Program not found' })
  const [cohorts, activities] = await Promise.all([
    ProgramCohort.find({ programSlug: req.params.slug, status: 'published' }).sort({ sortOrder: 1, year: -1 }).lean(),
    ProgramActivity.find({ programSlug: req.params.slug, status: 'published' }).sort({ activityDate: -1, sortOrder: 1 }).lean(),
  ])
  res.json({ program, cohorts, activities })
}))

router.get('/team', asyncRoute(async (_req, res) => {
  const members = await TeamMember.find({ status: 'published' }).sort({ founder: -1, sortOrder: 1, createdAt: 1 }).lean()
  res.json(members)
}))

router.post('/contact', asyncRoute(async (req, res) => {
  const body = req.body || {}
  const name = text(body.name)
  const email = text(body.email).toLowerCase()
  const subject = text(body.subject)
  const message = text(body.message)
  if (name.length < 2 || name.length > 140) return res.status(400).json({ message: 'Please enter your name.' })
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 180) return res.status(400).json({ message: 'Please enter a valid email address.' })
  if (subject.length < 3 || subject.length > 180) return res.status(400).json({ message: 'Please enter a subject.' })
  if (message.length < 10 || message.length > 3000) return res.status(400).json({ message: 'Your message must contain between 10 and 3000 characters.' })
  if (body.consent !== true) return res.status(400).json({ message: 'Please consent to being contacted about this message.' })
  const item = await ContactMessage.create({ name, email, subject, message, consent: true })
  res.status(201).json({ id: item._id, received: true })
}))

router.get('/webinars', asyncRoute(async (_req, res) => {
  const webinars = await Webinar.find({ status: { $in: ['open', 'closed'] } }).sort({ scheduledAt: 1, createdAt: -1 })
  res.json(webinars)
}))

router.post('/cyberambassador/inscriptions', asyncRoute(async (req, res) => {
  if (!CYBERAMBASSADOR_APPLICATIONS_OPEN) {
    return res.status(410).json({
      message: 'Les candidatures sont closes pour cette édition. Suivez @sykoticenter sur les réseaux sociaux pour connaître le prochain appel à candidatures.',
    })
  }

  const body = req.body || {}
  const birthDate = new Date(body.dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) {
    return res.status(400).json({ message: 'Une date de naissance valide est requise.' })
  }

  const today = new Date()
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear()
  const monthDifference = today.getUTCMonth() - birthDate.getUTCMonth()
  if (monthDifference < 0 || (monthDifference === 0 && today.getUTCDate() < birthDate.getUTCDate())) age -= 1

  if (age < 15 || age > 24) {
    return res.status(400).json({ message: 'Les candidats doivent avoir entre 15 et 24 ans.' })
  }

  const declarations = body.declarations || {}
  if (!declarations.accurate || !declarations.noSelectionGuarantee || !declarations.participationCommitment) {
    return res.status(400).json({ message: 'Toutes les déclarations doivent être acceptées.' })
  }

  if (!Array.isArray(body.interests) || body.interests.length === 0) {
    return res.status(400).json({ message: 'Sélectionnez au moins un centre d’intérêt lié au programme.' })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const existingApplication = await CyberambassadorInscription.findOne({ email, cohort: 'pilot-2026' })
  if (existingApplication) {
    return res.status(409).json({ message: 'Une candidature a déjà été envoyée avec cette adresse e-mail.' })
  }

  const inscription = await CyberambassadorInscription.create({
    ...body,
    email,
    age,
    dateOfBirth: birthDate,
    cohort: 'pilot-2026',
    status: 'new',
  })
  res.status(201).json(inscription)
}))

// Membership application (focused form at /membership). Multipart: "payload" JSON + optional "cv" file.
router.post('/membership/applications', cvUpload.single('cv'), asyncRoute(async (req, res) => {
  let body
  try { body = JSON.parse(req.body?.payload || '{}') } catch { return res.status(400).json({ message: 'Invalid form data.' }) }
  const fr = body.lang === 'fr'
  const msg = (en, frText) => (fr ? frText : en)
  if (body.website) return res.status(201).json({ received: true })
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (membershipSubmissions.get(ip) || []).filter((time) => now - time < 60 * 60 * 1000)
  if (recent.length >= 5) return res.status(429).json({ message: msg('Too many attempts. Please try again later.', 'Trop de tentatives. Veuillez réessayer plus tard.') })

  const fullName = text(body.fullName)
  const email = text(body.email).toLowerCase()
  const motivation = text(body.motivation)
  const commitments = body.commitments || {}
  if (fullName.length < 3 || fullName.length > 140) return res.status(400).json({ message: msg('Please enter your full name.', 'Indiquez votre nom complet.') })
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 180) return res.status(400).json({ message: msg('Please enter a valid email address.', 'Indiquez une adresse e-mail valide.') })
  if (text(body.phone).length < 6) return res.status(400).json({ message: msg('Please enter a phone or WhatsApp number.', 'Indiquez un numéro de téléphone ou WhatsApp.') })
  if (!text(body.city) || !text(body.country)) return res.status(400).json({ message: msg('Please enter your city and country.', 'Indiquez votre ville et votre pays.') })
  if (motivation.length < 150) return res.status(400).json({ message: msg('Your motivation should be at least 150 characters.', 'Votre motivation doit contenir au moins 150 caractères.') })
  if (!['active', 'supporting'].includes(body.memberType)) return res.status(400).json({ message: msg('Please choose a membership type.', 'Choisissez un type d’adhésion.') })
  if (!['fee', 'statutes', 'safeguarding', 'accurate', 'dataConsent'].every((key) => commitments[key] === true)) return res.status(400).json({ message: msg('Please accept all the commitments.', 'Merci d’accepter tous les engagements.') })
  const profileUrl = text(body.profileUrl)
  if (profileUrl && !isWebUrl(profileUrl)) return res.status(400).json({ message: msg('The profile link must start with http:// or https://', 'Le lien de profil doit commencer par http:// ou https://') })
  const dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : undefined
  if (dateOfBirth && (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > new Date() || dateOfBirth.getFullYear() < 1920)) return res.status(400).json({ message: msg('Invalid date of birth.', 'Date de naissance invalide.') })

  const existing = await MembershipApplication.exists({ email, cohort: MEMBERSHIP_COHORT, status: { $ne: 'declined' } })
  if (existing) return res.status(409).json({ message: msg('An application with this email has already been received this year. We will contact you.', 'Une candidature avec cette adresse e-mail a déjà été reçue cette année. Nous vous recontacterons.') })

  const long = (value, max) => text(value).slice(0, max)
  const application = await MembershipApplication.create({
    cohort: MEMBERSHIP_COHORT, lang: fr ? 'fr' : 'en',
    fullName, email, phone: long(body.phone, 40), dateOfBirth, gender: long(body.gender, 40),
    city: long(body.city, 120), region: long(body.region, 120), country: long(body.country, 120),
    occupation: long(body.occupation, 80), organization: long(body.organization, 160), fieldOfStudy: long(body.fieldOfStudy, 160), educationLevel: long(body.educationLevel, 80),
    skills: listOf(body.skills, 20), otherSkills: long(body.otherSkills, 300), languages: listOf(body.languages, 6), profileUrl,
    cv: req.file ? { name: req.file.originalname.slice(0, 200), contentType: req.file.mimetype, size: req.file.size, data: req.file.buffer } : undefined,
    memberType: body.memberType, departments: listOf(body.departments, 5), availability: long(body.availability, 80), participationMode: long(body.participationMode, 80), referralSource: long(body.referralSource, 160),
    motivation: long(motivation, 3000), experience: long(body.experience, 3000), contribution: long(body.contribution, 3000), expectations: long(body.expectations, 2000), referee: long(body.referee, 300),
    paymentPlan: long(body.paymentPlan, 40), interviewMode: long(body.interviewMode, 40),
    commitments: { fee: true, statutes: true, safeguarding: true, accurate: true, dataConsent: true },
  })
  recent.push(now)
  membershipSubmissions.set(ip, recent)
  res.status(201).json({ id: application._id, received: true })
}))

// Get Involved interest form. Only whitelisted fields are stored.
router.post('/support', asyncRoute(async (req, res) => {
  const body = req.body || {}
  const fr = body.lang === 'fr'
  if (body.website) return res.status(201).json({ received: true })
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (supportSubmissions.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000)
  if (recent.length >= 5) return res.status(429).json({ message: fr ? 'Trop de tentatives. Veuillez réessayer dans quelques minutes.' : 'Too many attempts. Please try again in a few minutes.' })

  const name = text(body.name)
  const email = text(body.email).toLowerCase()
  const message = text(body.message)
  const contributionType = SUPPORT_TYPES.includes(body.contributionType) ? body.contributionType : 'other'
  const amount = body.amount === '' || body.amount == null ? undefined : Number(body.amount)
  if (name.length < 2 || name.length > 140) return res.status(400).json({ message: fr ? 'Indiquez votre nom.' : 'Please enter your name.' })
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 180) return res.status(400).json({ message: fr ? 'Indiquez une adresse e-mail valide.' : 'Please enter a valid email address.' })
  if (message.length < 10 || message.length > 3000) return res.status(400).json({ message: fr ? 'Votre message doit contenir entre 10 et 3000 caractères.' : 'Your message must contain between 10 and 3000 characters.' })
  if (amount !== undefined && (!Number.isFinite(amount) || amount < 0 || amount > 1e10)) return res.status(400).json({ message: fr ? 'Montant invalide.' : 'Invalid amount.' })
  if (body.consent !== true) return res.status(400).json({ message: fr ? 'Merci d’accepter d’être recontacté·e.' : 'Please agree to be contacted about your request.' })

  const support = await Support.create({
    name, email, message, contributionType, amount,
    phone: text(body.phone).slice(0, 40),
    organization: text(body.organization).slice(0, 160),
    level: text(body.level).slice(0, 120),
    lang: fr ? 'fr' : 'en',
    currency: 'XAF',
  })
  recent.push(now)
  supportSubmissions.set(ip, recent)
  res.status(201).json({ id: support._id, received: true })
}))

export default router
