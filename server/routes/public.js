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
  const inscription = await CyberambassadorInscription.create(req.body)
  res.status(201).json(inscription)
}))

router.post('/support', asyncRoute(async (req, res) => {
  const support = await Support.create(req.body)
  res.status(201).json(support)
}))

export default router
