/* global process, Buffer */
import cors from 'cors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './db.js'
import adminRoutes from './routes/admin.js'
import publicRoutes from './routes/public.js'
import MediaAsset from './models/MediaAsset.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const defaultProductionOrigins = ['https://www.sykoticenter.org', 'https://sykoticenter.org']
const configuredOrigins = [
  ...defaultProductionOrigins,
  ...(process.env.CLIENT_ORIGIN?.split(',') || []),
].map((origin) => origin.trim()).filter(Boolean)

app.use(cors({
  exposedHeaders: ['Content-Disposition'],
  origin(origin, callback) {
    const isLocalDevelopmentOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '')
    if (!origin || configuredOrigins.includes(origin) || isLocalDevelopmentOrigin) {
      return callback(null, true)
    }
    return callback(new Error('Origine non autorisée par la politique CORS'))
  },
}))
app.use(express.json({ limit: '2mb' }))
app.use(async (_req, _res, next) => {
  try {
    await connectDb()
    next()
  } catch (error) {
    next(error)
  }
})
app.get('/uploads/media/:id', async (req, res, next) => {
  try {
    if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(404).end()
    const asset = await MediaAsset.findById(req.params.id).select('+data contentType updatedAt').lean()
    if (!asset) return res.status(404).end()
    res.set({
      'Content-Type': asset.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Content-Type-Options': 'nosniff',
      ...(asset.contentType === 'image/svg+xml' && { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox" }),
    })
    return res.send(asset.data.buffer ? Buffer.from(asset.data.buffer) : asset.data)
  } catch (error) {
    return next(error)
  }
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'SykotiCenter API' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'File too large (4 MB max). / Fichier trop volumineux (4 Mo max).' })
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' })
})

export default app
