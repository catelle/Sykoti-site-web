import express from 'express'
import multer from 'multer'
import Article from '../models/Article.js'
import CyberambassadorInscription from '../models/CyberambassadorInscription.js'
import Report from '../models/Report.js'
import Support from '../models/Support.js'
import Webinar from '../models/Webinar.js'

const router = express.Router()
const upload = multer({ dest: 'server/uploads/' })
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
const CYBERAMBASSADOR_APPLICATIONS_OPEN = false
const CYBERCOMP_TRANSMISSION_INDEXES = [5, 7, 11, 15, 20]

router.post('/cyberambassador/cybercomp/access', asyncRoute(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const applicant = await CyberambassadorInscription.findOne({ email, cohort: 'pilot-2026' }).select('fullName email cybercomp.taken cybercomp.feedback.submittedAt')
  if (!applicant) return res.status(404).json({ message: 'Cette adresse e-mail ne correspond pas à une candidature CyberAmbassador.' })
  if (applicant.cybercomp?.taken) return res.status(409).json({ message: 'Vous avez déjà passé le challenge CyberComp. Une seule participation est autorisée.' })

  res.json({ applicant: { fullName: applicant.fullName, email: applicant.email, cybercompTaken: Boolean(applicant.cybercomp?.taken), feedbackSubmitted: Boolean(applicant.cybercomp?.feedback?.submittedAt) } })
}))

router.get('/cyberambassador/cybercomp/feedback', asyncRoute(async (_req, res) => {
  const applicants = await CyberambassadorInscription.find({
    'cybercomp.taken': true,
    'cybercomp.feedback.comment': { $exists: true, $ne: '' },
  }).select('fullName cybercomp.feedback').sort({ 'cybercomp.feedback.submittedAt': -1 }).limit(30).lean()

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
  const applicant = await CyberambassadorInscription.findOneAndUpdate(
    { email, cohort: 'pilot-2026', 'cybercomp.taken': true },
    { $set: { 'cybercomp.feedback': { comment, rating, submittedAt: new Date() } } },
    { new: true, runValidators: true }
  ).select('fullName cybercomp.feedback')
  if (!applicant) return res.status(404).json({ message: 'Terminez le challenge CyberComp avant de laisser un commentaire.' })
  res.status(201).json({ feedback: applicant.cybercomp.feedback })
}))

router.post('/cyberambassador/cybercomp/results', asyncRoute(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const answers = Array.isArray(req.body?.answers) ? req.body.answers.map(Number) : []
  const supportedQuestionCounts = [21, 26]
  if (!supportedQuestionCounts.includes(answers.length) || answers.some((answer) => !Number.isInteger(answer) || answer < 1 || answer > 4)) {
    return res.status(400).json({ message: 'Toutes les réponses CyberComp sont requises.' })
  }

  const total = answers.reduce((sum, answer) => sum + answer, 0)
  const scoreRatio = total / (answers.length * 4)
  const transmissionAnswers = CYBERCOMP_TRANSMISSION_INDEXES.map((index) => answers[index]).filter(Boolean)
  const transmissionAverage = transmissionAnswers.reduce((sum, answer) => sum + answer, 0) / transmissionAnswers.length
  const demonstratedTransmission = transmissionAnswers.filter((answer) => answer >= 3).length
  const canTransmit = transmissionAverage >= 3 && demonstratedTransmission >= 3
  const canLeadTransmission = transmissionAverage >= 3.6 && transmissionAnswers.every((answer) => answer >= 3)
  const expectedLevel = scoreRatio <= .65
    ? 'Fondation'
    : scoreRatio <= .82 || !canTransmit
      ? 'Intermédiaire'
      : scoreRatio <= .93 || !canLeadTransmission
        ? 'Avancé'
        : 'Hautement spécialisé'
  const domains = Array.isArray(req.body?.domains) ? req.body.domains : []
  if (domains.length !== 5) return res.status(400).json({ message: 'Les résultats des cinq domaines sont requis.' })
  const applicant = await CyberambassadorInscription.findOneAndUpdate(
    { email, cohort: 'pilot-2026', 'cybercomp.taken': { $ne: true } },
    { $set: { 'cybercomp.taken': true, 'cybercomp.takenAt': new Date(), 'cybercomp.phase': req.body?.phase === 'Finale' ? 'Finale' : 'Initiale', 'cybercomp.total': total, 'cybercomp.level': expectedLevel, 'cybercomp.answers': answers, 'cybercomp.domains': domains.map((domain) => ({ name: String(domain.name || ''), score: Number(domain.score), max: Number(domain.max) })) } },
    { new: true, runValidators: true }
  ).select('fullName email cybercomp')

  if (!applicant) {
    const exists = await CyberambassadorInscription.exists({ email, cohort: 'pilot-2026' })
    return res.status(exists ? 409 : 404).json({ message: exists ? 'Vous avez déjà passé le challenge CyberComp. Une seule participation est autorisée.' : 'Cette adresse e-mail ne correspond pas à une candidature CyberAmbassador.' })
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
