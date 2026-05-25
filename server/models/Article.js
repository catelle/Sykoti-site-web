import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, default: 'Digital safety' },
    coverUrl: String,
    author: { type: String, default: 'SykotiCenter' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Article', articleSchema)
