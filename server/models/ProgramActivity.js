import mongoose from 'mongoose'

const programActivitySchema = new mongoose.Schema({
  programSlug: { type: String, required: true, lowercase: true, trim: true },
  cohortSlug: { type: String, lowercase: true, trim: true, default: '' },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, trim: true, maxlength: 1800 },
  category: { type: String, trim: true, maxlength: 100, default: 'Activity' },
  activityDate: Date,
  location: { type: String, trim: true, maxlength: 160, default: '' },
  coverUrl: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true })

programActivitySchema.index({ programSlug: 1, cohortSlug: 1, activityDate: -1 })
export default mongoose.model('ProgramActivity', programActivitySchema)
