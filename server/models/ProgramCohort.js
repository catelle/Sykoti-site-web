import mongoose from 'mongoose'

const programCohortSchema = new mongoose.Schema({
  programSlug: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
  year: { type: Number, min: 2000, max: 2200 },
  introduction: { type: String, trim: true, maxlength: 1500, default: '' },
  coverUrl: { type: String, trim: true, default: '' },
  statusLabel: { type: String, trim: true, maxlength: 120, default: '' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true })

programCohortSchema.index({ programSlug: 1, slug: 1 }, { unique: true })
export default mongoose.model('ProgramCohort', programCohortSchema)
