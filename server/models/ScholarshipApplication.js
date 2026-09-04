import mongoose from 'mongoose'

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
  },
  { timestamps: true }
)

export default mongoose.model('ScholarshipApplication', scholarshipApplicationSchema)
