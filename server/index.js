import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './db.js'
import adminRoutes from './routes/admin.js'
import publicRoutes from './routes/public.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }))
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'SykotiCenter API' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const port = process.env.PORT || 4000

connectDb()
  .then(() => {
    app.listen(port, () => console.log(`SykotiCenter API running on http://localhost:${port}`))
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
