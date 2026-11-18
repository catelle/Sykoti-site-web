import mongoose from 'mongoose'

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 100 },
  summary: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, trim: true, maxlength: 5000, default: '' },
  audience: { type: String, trim: true, maxlength: 220, default: '' },
  statusLabel: { type: String, trim: true, maxlength: 120, default: '' },
  coverUrl: { type: String, trim: true, default: '' },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true })

export default mongoose.model('Program', programSchema)
