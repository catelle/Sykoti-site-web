import express from 'express'
import multer from 'multer'
import Article from '../models/Article.js'
import CyberambassadorInscription from '../models/CyberambassadorInscription.js'
import Report from '../models/Report.js'
import Support from '../models/Support.js'
import Webinar from '../models/Webinar.js'
import Engagement, { ENGAGEMENT_AGE_RANGES, ENGAGEMENT_THEMES } from '../models/Engagement.js'
import ScholarshipApplication from '../models/ScholarshipApplication.js'

const router = express.Router()
const upload = multer({ dest: 'server/uploads/' })
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
const CYBERAMBASSADOR_APPLICATIONS_OPEN = false
const CYBERCOMP_TEST_EMAILS = new Set([
  'catelleningha@gmail.com',
  ...(process.env.CYBERCOMP_TEST_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean),
])
const engagementSubmissions = new Map()

const isCybercompTestEmail = (email) => CYBERCOMP_TEST_EMAILS.has(email)
const assessmentPhase = (value) => value === 'Finale' ? 'Finale' : 'Initiale'
const normalizeCommitment = (value) => {
  let commitment = String(value || '').trim()
  while (/^je m['’]engage\s+[àa]\s*/i.test(commitment)) {
    commitment = commitment.replace(/^je m['’]engage\s+[àa]\s*/i, '').trim()
  }
  return commitment
}
const challengeFields = 'fullName email cybercomp.taken cybercomp.initialTaken cybercomp.finalTaken cybercomp.phase cybercomp.feedback.submittedAt'

async function findCybercompApplicant(email) {
  const cyberambassador = await CyberambassadorInscription.findOne({ email, cohort: 'pilot-2026' }).select(challengeFields)
  if (cyberambassador) return { applicant: cyberambassador, model: CyberambassadorInscription, cohort: 'pilot-2026' }

  const scholarship = await ScholarshipApplication.findOne({ email, cohort: 'scholarship-2026' }).select(challengeFields)
  if (scholarship) return { applicant: scholarship, model: ScholarshipApplication, cohort: 'scholarship-2026' }

  return null
}

// Match applicants who have not yet submitted this phase. Initiale keeps a
// legacy fallback; old shared results must not block the newly introduced
// Finale attempt.
const phaseAvailableQuery = (phase) => phase === 'Finale'
  ? { 'cybercomp.finalTaken': { $ne: true } }
  : { $nor: [{ 'cybercomp.initialTaken': true }, { 'cybercomp.taken': true, 'cybercomp.phase': 'Initiale' }] }

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
  res.json({
    items: items.map((item) => ({ ...item, commitment: normalizeCommitment(item.commitment) })),
    total,
    shared,
  })
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
  const { applicant, model } = match
  const alreadyTaken = phase === 'Finale'
    ? applicant.cybercomp?.finalTaken === true
    : applicant.cybercomp?.initialTaken === true || (applicant.cybercomp?.taken === true && applicant.cybercomp?.phase === 'Initiale')
  // Explicit test accounts are intentionally reusable so both phases can be
  // exercised repeatedly during QA. Real applicants remain one-attempt-per-phase.
  if (alreadyTaken && !isCybercompTestEmail(email)) return res.status(409).json({ message: `Vous avez déjà passé l’évaluation ${phase}.` })

  // Migrate the legacy single-result record before a Finale result replaces
  // its phase, so the old Initiale attempt remains protected as well.
  if (phase === 'Finale' && applicant.cybercomp?.taken === true && applicant.cybercomp?.phase === 'Initiale') {
    await model.updateOne(
      { _id: applicant._id, 'cybercomp.initialTotal': { $exists: false } },
      { $set: {
        'cybercomp.initialTaken': true,
        'cybercomp.initialTotal': applicant.cybercomp.total,
        'cybercomp.initialMax': (applicant.cybercomp.answers || []).length * 4 || 84,
      } }
    )
  }

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
  const applicant = await CyberambassadorInscription.findOneAndUpdate(
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

router.get('/reports', asyncRoute(async (_req, res) => {
  const reports = await Report.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 })
  res.json(reports)
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

router.post('/support', asyncRoute(async (req, res) => {
  const support = await Support.create(req.body)
  res.status(201).json(support)
}))

export default router
