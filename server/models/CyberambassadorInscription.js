import mongoose from 'mongoose'

const inscriptionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: String,
    country: String,
    city: String,
    profile: { type: String, default: 'Applicant' },
    program: {
      type: String,
      enum: ['fellowship', 'platform', 'community'],
      default: 'fellowship',
    },
    motivation: { type: String, required: true },
    status: { type: String, enum: ['new', 'reviewing', 'accepted', 'rejected'], default: 'new' },
  },
  { timestamps: true }
)

export default mongoose.model('CyberambassadorInscription', inscriptionSchema)
