import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 140 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 180 },
  subject: { type: String, required: true, trim: true, maxlength: 180 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  consent: { type: Boolean, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
}, { timestamps: true })

export default mongoose.model('ContactMessage', contactMessageSchema)
