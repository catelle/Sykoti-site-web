import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDb } from '../db.js'
import Admin from '../models/Admin.js'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required')
  process.exit(1)
}

await connectDb()

const passwordHash = await bcrypt.hash(password, 12)
await Admin.findOneAndUpdate(
  { email: email.toLowerCase() },
  { email: email.toLowerCase(), passwordHash, name: process.env.ADMIN_NAME || 'SykotiCenter Admin' },
  { upsert: true, new: true }
)

console.log(`Admin account ready: ${email}`)
process.exit(0)
