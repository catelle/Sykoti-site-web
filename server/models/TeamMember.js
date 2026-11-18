import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, required: true, trim: true, maxlength: 180 },
  biography: { type: String, required: true, trim: true, maxlength: 1800 },
  photoUrl: { type: String, trim: true, default: '' },
  linkedinUrl: { type: String, trim: true, default: '' },
  founder: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true })

export default mongoose.model('TeamMember', teamMemberSchema)
