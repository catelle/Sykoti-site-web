import mongoose from 'mongoose'

export const ENGAGEMENT_THEMES = [
  'Protection de mes données personnelles',
  'Sécurité de mes comptes',
  'Vérification des informations',
  'Respect des autres en ligne',
  'Utilisation responsable des réseaux sociaux',
  'Intelligence artificielle responsable',
  'Protection contre les arnaques en ligne',
  'Sensibilisation de mon entourage',
  'Autre',
]

export const ENGAGEMENT_AGE_RANGES = [
  'Moins de 15 ans', '15–18 ans', '19–24 ans', '25–34 ans',
  '35 ans et plus', 'Je préfère ne pas répondre',
]

const engagementSchema = new mongoose.Schema({
  displayName: { type: String, trim: true, maxlength: 60, default: '' },
  ageRange: { type: String, enum: [...ENGAGEMENT_AGE_RANGES, ''], default: '' },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  theme: { type: String, required: true, enum: ENGAGEMENT_THEMES },
  commitment: { type: String, required: true, trim: true, maxlength: 250 },
  phone: { type: String, trim: true, maxlength: 40, default: '' },
  contactConsent: { type: Boolean, default: false },
  consentToPublish: { type: Boolean, default: false },
  status: { type: String, enum: ['private', 'pending', 'approved', 'rejected'], default: 'private' },
  approvedAt: Date,
}, { timestamps: true })

engagementSchema.index({ consentToPublish: 1, status: 1, approvedAt: -1 })
engagementSchema.index({ location: 1 })
engagementSchema.index({ theme: 1 })

export default mongoose.model('Engagement', engagementSchema)
