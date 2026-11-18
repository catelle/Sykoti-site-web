import mongoose from 'mongoose'

// Admin overrides for the editable website pages (see src/content/siteContent.js).
// `shared` holds language-independent values (images, settings); `en`/`fr` hold copy.
const siteContentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
  shared: { type: mongoose.Schema.Types.Mixed, default: {} },
  en: { type: mongoose.Schema.Types.Mixed, default: {} },
  fr: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedBy: { type: String, trim: true, default: '' },
}, { timestamps: true, minimize: false })

export default mongoose.model('SiteContent', siteContentSchema)
