import mongoose from 'mongoose'

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    contributionType: String,
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    organization: { type: String, trim: true, maxlength: 160, default: '' },
    level: { type: String, trim: true, maxlength: 120, default: '' },
    lang: { type: String, trim: true, maxlength: 5, default: '' },
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'XAF' },
    message: String,
    paymentMethod: { type: String, default: 'manual' },
    paymentReference: String,
    status: { type: String, enum: ['pledged', 'contacted', 'received', 'cancelled'], default: 'pledged' },
  },
  { timestamps: true }
)

export default mongoose.model('Support', supportSchema)
