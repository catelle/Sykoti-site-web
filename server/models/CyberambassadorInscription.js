import mongoose from 'mongoose'

const inscriptionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true, min: 15, max: 24 },
    gender: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    currentOccupation: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    highestEducation: { type: String, required: true, trim: true },
    mainDevice: { type: String, enum: ['Smartphone', 'Laptop', 'Tablet', 'Desktop'], required: true },
    internetAccess: { type: String, enum: ['Stable', 'Moderate', 'Limited'], required: true },
    motivation: { type: String, required: true },
    interests: [{ type: String, trim: true }],
    otherInterest: { type: String, trim: true },
    communityExperience: { type: String, required: true },
    digitalQuestion: { type: String, required: true },
    selectedCompany: { type: String, required: true, trim: true },
    otherCompany: { type: String, trim: true },
    companyReason: { type: String, required: true },
    challengeMotivation: { type: String, required: true },
    selectionReason: { type: String, required: true },
    graduationAttendance: {
      type: String,
      enum: ['In person (Yaounde)', 'Online', 'Not sure yet'],
      required: true,
    },
    declarations: {
      accurate: { type: Boolean, required: true },
      noSelectionGuarantee: { type: Boolean, required: true },
      participationCommitment: { type: Boolean, required: true },
    },
    cohort: { type: String, default: 'pilot-2026' },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'shortlisted', 'accepted', 'declined', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
)

export default mongoose.model('CyberambassadorInscription', inscriptionSchema)
