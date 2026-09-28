import mongoose from 'mongoose'

const guardianVoiceApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 180 },
    whatsapp: { type: String, required: true, trim: true, maxlength: 40 },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, trim: true, maxlength: 60, default: '' },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    occupation: { type: String, required: true, trim: true, maxlength: 40 },
    otherOccupation: { type: String, trim: true, maxlength: 100, default: '' },
    platforms: [{ type: String, trim: true }],
    socialProfiles: [{ type: String, trim: true, maxlength: 500 }],
    hasCreatedContent: { type: Boolean, required: true },
    contentExample: { type: String, trim: true, maxlength: 500, default: '' },
    motivation: { type: String, required: true, trim: true, maxlength: 1200 },
    digitalIssue: { type: String, required: true, trim: true, maxlength: 80 },
    otherDigitalIssue: { type: String, trim: true, maxlength: 120, default: '' },
    trainingCommitment: { type: Boolean, required: true },
    publishingCommitment: { type: Boolean, required: true },
    hasEquipmentAccess: { type: Boolean, required: true },
    dailyTime: { type: String, required: true, trim: true, maxlength: 40 },
    challengeAnswer: { type: String, required: true, trim: true, maxlength: 800 },
    confirmations: {
      selectionAndParticipation: { type: Boolean, required: true },
      rewardsCriteria: { type: Boolean, required: true },
    },
    campaign: { type: String, default: 'guardians-voice-30-day' },
    status: { type: String, enum: ['new', 'reviewing', 'shortlisted', 'accepted', 'declined'], default: 'new' },
  },
  { timestamps: true }
)

guardianVoiceApplicationSchema.index({ email: 1, campaign: 1 }, { unique: true })

export default mongoose.model('GuardianVoiceApplication', guardianVoiceApplicationSchema)
