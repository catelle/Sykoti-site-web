import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxlength: 160, default: '' },
  category: { type: String, enum: ['portrait', 'formation', 'graduation', 'community-action', 'proof'], required: true },
  url: { type: String, trim: true, required: true },
  alt: { type: String, trim: true, required: true, maxlength: 240 },
  caption: { type: String, trim: true, maxlength: 300, default: '' },
  credit: { type: String, trim: true, maxlength: 160, default: '' },
  participant: { type: String, trim: true, default: '' },
  phase: { type: String, trim: true, default: '' },
  capstone: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
}, { _id: true })

const testimonialSchema = new mongoose.Schema({
  quote: { type: String, trim: true, required: true, maxlength: 1000 },
  author: { type: String, trim: true, default: '' },
  context: { type: String, trim: true, default: '' },
  publicationConsent: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  sortOrder: { type: Number, default: 0 },
}, { _id: true })

const cyberambassadorContentSchema = new mongoose.Schema({
  slug: { type: String, unique: true, default: 'public' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  media: { type: [mediaSchema], default: [] },
  testimonials: { type: [testimonialSchema], default: [] },
  updatedBy: { type: String, trim: true, default: '' },
}, { timestamps: true })

export default mongoose.model('CyberambassadorContent', cyberambassadorContentSchema)
