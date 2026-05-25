import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    period: { type: String, default: 'Bimensual' },
    category: { type: String, default: 'Online threat report' },
    source: { type: String, default: 'SykotiCenter' },
    fileUrl: String,
    fileName: String,
    coverUrl: String,
    status: { type: String, enum: ['draft', 'pending', 'published', 'archived'], default: 'pending' },
    shareCount: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Report', reportSchema)
