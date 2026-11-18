import mongoose from 'mongoose'

// Uploaded files stored in MongoDB so they survive serverless deployments
// (Vercel's filesystem is ephemeral). Served from GET /uploads/media/:id.
const mediaAssetSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 240, default: '' },
  alt: { type: String, trim: true, maxlength: 240, default: '' },
  folder: { type: String, trim: true, maxlength: 60, default: 'library' },
  contentType: { type: String, required: true },
  size: { type: Number, default: 0 },
  width: Number,
  height: Number,
  data: { type: mongoose.Schema.Types.Buffer, required: true, select: false },
  uploadedBy: { type: String, trim: true, default: '' },
}, { timestamps: true })

mediaAssetSchema.virtual('url').get(function url() {
  return `/uploads/media/${this._id}`
})
mediaAssetSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.data
    return ret
  },
})

export default mongoose.model('MediaAsset', mediaAssetSchema)
