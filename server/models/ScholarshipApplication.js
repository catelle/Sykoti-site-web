import mongoose from 'mongoose'

const assessmentResultSchema = new mongoose.Schema({
  phase: { type: String, enum: ['Initiale', 'Finale'], required: true },
  total: { type: Number, min: 21, max: 104, required: true },
  max: { type: Number, min: 84, max: 104, required: true },
  takenAt: { type: Date, default: Date.now },
}, { _id: false })

const scholarshipApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true, min: 15, max: 35 },
    // Optional for backward compatibility with applications submitted before country was collected.
    country: { type: String, trim: true, default: '' },
    city: { type: String, required: true, trim: true },
    currentSituation: { type: String, required: true, trim: true },
    need: { type: String, required: true, maxlength: 1200 },
    accessBarrier: { type: String, required: true, trim: true },
    device: { type: String, required: true, trim: true },
    internetAccess: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    preferredSchedule: { type: String, required: true, trim: true },
    startAvailability: { type: String, required: true, trim: true },
    declarations: {
      accurate: { type: Boolean, required: true },
      twoWeekCommitment: { type: Boolean, required: true },
      consentToContact: { type: Boolean, required: true },
    },
    cohort: { type: String, default: 'scholarship-2026' },
    status: { type: String, enum: ['new', 'reviewing', 'shortlisted', 'accepted', 'declined'], default: 'new' },
    cybercomp: {
      taken: { type: Boolean, default: false },
      initialTaken: { type: Boolean, default: false },
      finalTaken: { type: Boolean, default: false },
      initialTotal: { type: Number, min: 21, max: 104 },
      finalTotal: { type: Number, min: 21, max: 104 },
      initialMax: { type: Number, min: 84, max: 104 },
      finalMax: { type: Number, min: 84, max: 104 },
      results: [assessmentResultSchema],
      takenAt: Date,
      phase: { type: String, enum: ['Initiale', 'Finale'] },
      total: { type: Number, min: 21, max: 104 },
      level: { type: String, enum: ['Fondation', 'Intermédiaire', 'Avancé', 'Hautement spécialisé'] },
      answers: [{ type: Number, min: 1, max: 4 }],
      domains: [{ name: { type: String, trim: true }, score: Number, max: Number }],
      feedback: {
        comment: { type: String, trim: true, maxlength: 700 },
        rating: { type: Number, min: 1, max: 5 },
        submittedAt: Date,
      },
    },
  },
  { timestamps: true }
)

export default mongoose.model('ScholarshipApplication', scholarshipApplicationSchema)
