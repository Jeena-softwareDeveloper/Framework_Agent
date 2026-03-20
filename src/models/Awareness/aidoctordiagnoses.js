import mongoose from 'mongoose';

const aidoctordiagnosesSchema = new mongoose.Schema({
  diseaseName: { type: String },
  confidence: { type: Number },
  severity: { type: String },
  symptoms: { type: String },
  naturalCure: { type: String },
  image: { type: String },
  crop: { type: String },
  isResolved: { type: Boolean },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Aidoctordiagnoses = mongoose.model('aidoctordiagnoses', aidoctordiagnosesSchema);
