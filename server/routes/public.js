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
