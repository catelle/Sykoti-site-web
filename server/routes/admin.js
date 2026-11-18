/* global process, Buffer */
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
import ScholarshipApplication from '../models/ScholarshipApplication.js'
import GuardianVoiceApplication from '../models/GuardianVoiceApplication.js'
import CyberambassadorContent from '../models/CyberambassadorContent.js'
import Program from '../models/Program.js'
import ProgramCohort from '../models/ProgramCohort.js'
import ProgramActivity from '../models/ProgramActivity.js'
import TeamMember from '../models/TeamMember.js'
import ContactMessage from '../models/ContactMessage.js'
import SiteContent from '../models/SiteContent.js'
import MediaAsset from '../models/MediaAsset.js'
import MembershipApplication from '../models/MembershipApplication.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()
// Files are kept in memory then stored in MongoDB (Vercel's filesystem is not persistent).
// 4.5 MB matches Vercel's request body limit; the admin resizes images before upload.
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024
const UPLOAD_TYPES = /^(image\/(jpeg|png|webp|gif|svg\+xml|avif)|application\/pdf)$/
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 4 },
  fileFilter(_req, file, callback) {
    if (UPLOAD_TYPES.test(file.mimetype)) return callback(null, true)
    const error = new Error('Type de fichier non pris en charge (images ou PDF uniquement).')
    error.status = 400
    return callback(error)
  },
})
const SITE_PAGES = ['global', 'home', 'about', 'programs', 'impact', 'resources', 'get-involved', 'reports']
const PROTECTED_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt']
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

async function storeUpload(file, admin, folder = 'library') {
  const asset = await MediaAsset.create({
    name: file.originalname,
    folder,
    contentType: file.mimetype,
    size: file.size,
    data: file.buffer,
    uploadedBy: admin?.email || '',
  })
  return asset.url
}

function cleanBody(body) {
  const clean = { ...(body || {}) }
  PROTECTED_FIELDS.forEach((field) => delete clean[field])
  return clean
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)

const collections = {
  reports: Report,
  articles: Article,
  webinars: Webinar,
  inscriptions: CyberambassadorInscription,
  supports: Support,
  engagements: Engagement,
  scholarships: ScholarshipApplication,
  'guardians-voice-applications': GuardianVoiceApplication,
  'cyberambassador-content': CyberambassadorContent,
  programs: Program,
  cohorts: ProgramCohort,
  activities: ProgramActivity,
  team: TeamMember,
  messages: ContactMessage,
  'membership-applications': MembershipApplication,
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

router.get('/me', asyncRoute(async (req, res) => {
  const record = await Admin.findById(req.admin.sub, { email: 1, name: 1 }).lean()
  if (!record) return res.status(401).json({ message: 'Admin account not found' })
  res.json({ admin: { email: record.email, name: record.name } })
}))

router.get('/overview', asyncRoute(async (_req, res) => {
  const entries = await Promise.all(Object.entries(collections).map(async ([name, Model]) => {
    if (!Model.schema.path('status')) return [name, { total: await Model.estimatedDocumentCount(), byStatus: {} }]
    const groups = await Model.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    const byStatus = Object.fromEntries(groups.map((group) => [group._id || 'new', group.count]))
    return [name, { total: groups.reduce((sum, group) => sum + group.count, 0), byStatus }]
  }))
  const [recentMessages, mediaCount, customPages] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    MediaAsset.estimatedDocumentCount(),
    SiteContent.find({}, { page: 1, updatedAt: 1, updatedBy: 1 }).sort({ updatedAt: -1 }).lean(),
  ])
  res.json({ counts: Object.fromEntries(entries), recentMessages, mediaCount, customPages })
}))

router.get('/membership-applications/:id/cv', asyncRoute(async (req, res) => {
  const application = await MembershipApplication.findById(req.params.id).select('+cv.data fullName cv.name cv.contentType').lean()
  if (!application?.cv?.data) return res.status(404).json({ message: 'No CV for this application' })
  const data = application.cv.data.buffer ? Buffer.from(application.cv.data.buffer) : application.cv.data
  res.set({
    'Content-Type': application.cv.contentType || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(application.cv.name || 'cv')}"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  res.send(data)
}))

router.get('/site-content', asyncRoute(async (_req, res) => {
  const docs = await SiteContent.find().lean()
  res.json({ pages: Object.fromEntries(docs.map((doc) => [doc.page, doc])) })
}))

router.put('/site-content/:page', asyncRoute(async (req, res) => {
  const { page } = req.params
  if (!SITE_PAGES.includes(page)) return res.status(404).json({ message: 'Page inconnue' })
  const { shared = {}, en = {}, fr = {} } = req.body || {}
  if (![shared, en, fr].every(isPlainObject)) return res.status(400).json({ message: 'Format de contenu invalide' })
  const doc = await SiteContent.findOneAndUpdate(
    { page },
    { page, shared, en, fr, updatedBy: req.admin.email },
    { new: true, upsert: true, runValidators: true },
  )
  res.json(doc)
}))

router.delete('/site-content/:page', asyncRoute(async (req, res) => {
  await SiteContent.deleteOne({ page: req.params.page })
  res.json({ reset: true })
}))

router.get('/media', asyncRoute(async (_req, res) => {
  const items = await MediaAsset.find().sort({ createdAt: -1 })
  res.json(items)
}))

router.post('/media', upload.single('file'), asyncRoute(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu' })
  const asset = await MediaAsset.create({
    name: req.body.name || req.file.originalname,
    alt: req.body.alt || '',
    folder: req.body.folder || 'library',
    contentType: req.file.mimetype,
    size: req.file.size,
    width: Number(req.body.width) || undefined,
    height: Number(req.body.height) || undefined,
    data: req.file.buffer,
    uploadedBy: req.admin.email,
  })
  res.status(201).json(asset)
}))

router.patch('/media/:id', asyncRoute(async (req, res) => {
  const { name, alt, folder } = req.body || {}
  const asset = await MediaAsset.findByIdAndUpdate(req.params.id, { ...(name !== undefined && { name }), ...(alt !== undefined && { alt }), ...(folder !== undefined && { folder }) }, { new: true, runValidators: true })
  if (!asset) return res.status(404).json({ message: 'Média introuvable' })
  res.json(asset)
}))

router.delete('/media/:id', asyncRoute(async (req, res) => {
  const asset = await MediaAsset.findByIdAndDelete(req.params.id)
  if (!asset) return res.status(404).json({ message: 'Média introuvable' })
  res.json({ deleted: true })
}))

router.get('/:resource', asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const items = await Model.find().sort({ createdAt: -1 })
  res.json(items)
}))

router.post('/:resource', asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const body = cleanBody(req.body)
  if (body.status === 'published' && !body.publishedAt) body.publishedAt = new Date()
  const item = await Model.create(body)
  res.status(201).json(item)
}))

router.post('/:resource/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }, { name: 'photoImage', maxCount: 1 }, { name: 'galleryImage', maxCount: 1 }]), asyncRoute(async (req, res) => {
  const Model = collections[req.params.resource]
  if (!Model) return res.status(404).json({ message: 'Unknown resource' })

  const body = { ...req.body }
  Object.keys(body).forEach((key) => {
    if (body[key] === '') delete body[key]
  })

  if (typeof body.speakers === 'string') {
    body.speakers = body.speakers.split(',').map((item) => item.trim()).filter(Boolean)
  }

  if (req.params.resource === 'cyberambassador-content') {
    for (const field of ['media', 'testimonials']) {
      if (typeof body[field] === 'string') {
        try {
          body[field] = JSON.parse(body[field])
        } catch {
          return res.status(400).json({ message: `${field} doit être un JSON valide.` })
        }
      }
    }
  }

  const file = req.files?.file?.[0]
  if (file) {
    body.fileName = file.originalname
    body.fileUrl = await storeUpload(file, req.admin, req.params.resource)
  }

  const coverImage = req.files?.coverImage?.[0]
  if (coverImage) body.coverUrl = await storeUpload(coverImage, req.admin, req.params.resource)

  const photoImage = req.files?.photoImage?.[0]
  if (photoImage) body.photoUrl = await storeUpload(photoImage, req.admin, req.params.resource)

  const galleryImage = req.files?.galleryImage?.[0]
  if (req.params.resource === 'cyberambassador-content' && galleryImage) {
    if (!body.galleryAlt) return res.status(400).json({ message: 'Le texte alternatif de l’image est requis.' })
    const mediaItem = {
      title: body.galleryTitle || galleryImage.originalname,
      category: body.galleryCategory || 'formation',
      url: await storeUpload(galleryImage, req.admin, 'cyberambassador'),
      alt: body.galleryAlt,
      caption: body.galleryCaption || '',
      credit: body.galleryCredit || '',
      participant: body.galleryParticipant || '',
      phase: body.galleryPhase || '',
      capstone: body.galleryCapstone || '',
      sortOrder: Number(body.gallerySortOrder || 0),
    }
    const item = await Model.findOneAndUpdate(
      { slug: body.slug || 'public' },
      { $setOnInsert: { slug: body.slug || 'public', status: body.status || 'draft' }, $push: { media: mediaItem } },
      { new: true, upsert: true, runValidators: true },
    )
    return res.status(201).json(item)
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

  const body = cleanBody(req.body)
  if (body.status === 'published' && !body.publishedAt) {
    const existing = await Model.findById(req.params.id, { publishedAt: 1 }).lean()
    if (!existing?.publishedAt) body.publishedAt = new Date()
  }
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
