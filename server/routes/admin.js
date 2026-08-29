/* global process */
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import Admin from '../models/Admin.js'
import Article from '../models/Article.js'
import CyberambassadorInscription from '../models/CyberambassadorInscription.js'
import Report from '../models/Report.js'
import Support from '../models/Support.js'
import Webinar from '../models/Webinar.js'
import Engagement from '../models/Engagement.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()
const upload = multer({ dest: 'server/uploads/' })
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)

const collections = {
  reports: Report,
  articles: Article,
  webinars: Webinar,
  inscriptions: CyberambassadorInscription,
  supports: Support,
  engagements: Engagement,
}

router.get('/engagements-dashboard/stats', requireAdmin, asyncRoute(async (_req, res) => {
  const start = new Date(); start.setHours(0, 0, 0, 0)
  const [total, today, consented, approved, pending, byLocation, byTheme, byAge] = await Promise.all([
    Engagement.countDocuments(), Engagement.countDocuments({ createdAt: { $gte: start } }),
    Engagement.countDocuments({ consentToPublish: true }), Engagement.countDocuments({ status: 'approved' }),
    Engagement.countDocuments({ status: 'pending' }),
    Engagement.aggregate([{ $group: { _id: '$location', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Engagement.aggregate([{ $group: { _id: '$theme', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Engagement.aggregate([{ $match: { ageRange: { $ne: '' } } }, { $group: { _id: '$ageRange', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
  ])
  res.json({ total, today, consented, approved, pending, byLocation, byTheme, byAge })
}))

router.post('/login', asyncRoute(async (req, res) => {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email: String(email || '').toLowerCase() })

  if (!admin || !(await bcrypt.compare(password || '', admin.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token, admin: { email: admin.email, name: admin.name } })
}))

router.use(requireAdmin)

router.get('/me', (req, res) => {
  res.json({ admin: req.admin })
})

router.get('/:resource', asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const items = await Model.find().sort({ createdAt: -1 })
  res.json(items)
}))

router.post('/:resource', asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const item = await Model.create(req.body)
  res.status(201).json(item)
}))

router.post('/:resource/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const body = { ...req.body }
  Object.keys(body).forEach((key) => {
    if (body[key] === '') delete body[key]
  })

  if (typeof body.speakers === 'string') {
    body.speakers = body.speakers.split(',').map((item) => item.trim()).filter(Boolean)
  }

  const file = req.files?.file?.[0]
  if (file) {
    body.fileName = file.originalname
    body.fileUrl = `/uploads/${file.filename}`
  }

  const coverImage = req.files?.coverImage?.[0]
  if (coverImage) {
    body.coverUrl = `/uploads/${coverImage.filename}`
  }

  if (body.status === 'published' && !body.publishedAt) {
    body.publishedAt = new Date()
  }

  const item = await Model.create(body)
  res.status(201).json(item)
}))

router.patch('/:resource/:id', asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const body = { ...req.body }
  if (req.params.resource === 'engagements') {
    if (!['pending', 'approved', 'rejected', 'private'].includes(body.status)) delete body.status
    if (body.status === 'approved') body.approvedAt = new Date()
  }
  const item = await Model.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
  if (!item) return res.status(404).json({ message: 'Item not found' })
  res.json(item)
}))

router.delete('/:resource/:id', asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const item = await Model.findByIdAndDelete(req.params.id)
  if (!item) return res.status(404).json({ message: 'Item not found' })
  res.json({ deleted: true })
}))

export default router
