import mongoose from 'mongoose'

const m1EvaluationSchema = new mongoose.Schema({
  participantCode: { type: String, required: true, trim: true, uppercase: true, maxlength: 80 },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, trim: true, lowercase: true, maxlength: 180, default: '' },
  city: { type: String, required: true, trim: true, maxlength: 120 },
  cohort: { type: String, required: true, trim: true, maxlength: 80, default: 'CyberA-Rise' },
  completionDate: { type: Date, required: true },
  newPracticeAdopted: { type: Boolean, required: true },
  newPractices: { type: [String], default: [] },
  practiceExample: { type: String, trim: true, maxlength: 1000, default: '' },
  voluntaryActionTaken: { type: Boolean, required: true },
  voluntaryActionDetails: { type: String, trim: true, maxlength: 1000, default: '' },
  riskActionTaken: { type: Boolean, required: true },
  riskActionExample: { type: String, trim: true, maxlength: 1000, default: '' },
  maintenanceObstacle: { type: String, trim: true, maxlength: 1000, default: '' },
  contactConsent: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['self_reported', 'documented', 'verified'], default: 'self_reported' },
}, { timestamps: true })

m1EvaluationSchema.index({ participantCode: 1, cohort: 1 }, { unique: true })
m1EvaluationSchema.index({ cohort: 1, createdAt: -1 })

export default mongoose.model('M1Evaluation', m1EvaluationSchema)
