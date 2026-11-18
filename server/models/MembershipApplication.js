import mongoose from 'mongoose'

// Membership applications submitted from /membership. The CV is stored privately
// (never served publicly) and is only downloadable by an authenticated admin.
const str = (max, extra = {}) => ({ type: String, trim: true, maxlength: max, default: '', ...extra })

const membershipApplicationSchema = new mongoose.Schema({
  cohort: str(20),
  lang: str(5),
  // About you
  fullName: str(140, { required: true }),
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 180 },
  phone: str(40),
  dateOfBirth: Date,
  gender: str(40),
  city: str(120),
  region: str(120),
  country: str(120),
  // Background
  occupation: str(80),
  organization: str(160),
  fieldOfStudy: str(160),
  educationLevel: str(80),
  skills: { type: [String], default: [] },
  otherSkills: str(300),
  languages: { type: [String], default: [] },
  profileUrl: str(300),
  cv: {
    name: str(200),
    contentType: str(120),
    size: Number,
    data: { type: mongoose.Schema.Types.Buffer, select: false },
  },
  // Engagement
  memberType: { type: String, enum: ['active', 'supporting'], default: 'active' },
  departments: { type: [String], default: [] },
  availability: str(80),
  participationMode: str(80),
  referralSource: str(160),
  // Motivation
  motivation: str(3000, { required: true }),
  experience: str(3000),
  contribution: str(3000),
  expectations: str(2000),
  referee: str(300),
  // Contribution & commitments
  paymentPlan: str(40),
  interviewMode: str(40),
  commitments: {
    fee: { type: Boolean, default: false },
    statutes: { type: Boolean, default: false },
    safeguarding: { type: Boolean, default: false },
    accurate: { type: Boolean, default: false },
    dataConsent: { type: Boolean, default: false },
  },
  // Review (admin only)
  status: { type: String, enum: ['new', 'reviewing', 'shortlisted', 'interview', 'accepted', 'declined'], default: 'new' },
  review: {
    score: { type: Number, min: 0, max: 5, default: 0 },
    notes: str(4000),
    interviewAt: Date,
  },
}, { timestamps: true })

membershipApplicationSchema.index({ email: 1, cohort: 1 })
membershipApplicationSchema.set('toJSON', {
  transform(_doc, ret) {
    if (ret.cv) { delete ret.cv.data; ret.hasCv = Boolean(ret.cv.name) }
    return ret
  },
})

export default mongoose.model('MembershipApplication', membershipApplicationSchema)
