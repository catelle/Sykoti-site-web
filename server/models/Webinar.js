import mongoose from 'mongoose'

function parseFlexibleDate(value) {
  if (!value || value instanceof Date) return value

  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (!trimmed) return undefined

  const frenchDate = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/)
  if (frenchDate) {
    const [, day, month, rawYear] = frenchDate
    const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear)
    const date = new Date(Date.UTC(year, Number(month) - 1, Number(day)))

    if (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === Number(month) - 1 &&
      date.getUTCDate() === Number(day)
    ) {
      return date
    }
  }

  return value
}

const webinarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    scheduledAt: { type: Date, set: parseFlexibleDate },
    speakers: [{ type: String }],
    coverUrl: String,
    registrationUrl: String,
    replayUrl: String,
    status: { type: String, enum: ['draft', 'open', 'closed', 'archived'], default: 'draft' },
  },
  { timestamps: true }
)

export default mongoose.model('Webinar', webinarSchema)
