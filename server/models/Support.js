import mongoose from 'mongoose'

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    contributionType: String,
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'XAF' },
    message: String,
    paymentMethod: { type: String, default: 'manual' },
    paymentReference: String,
    status: { type: String, enum: ['pledged', 'received', 'cancelled'], default: 'pledged' },
  },
  { timestamps: true }
)

export default mongoose.model('Support', supportSchema)
