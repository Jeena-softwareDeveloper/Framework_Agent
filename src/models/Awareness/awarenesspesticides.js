import mongoose from 'mongoose';

const awarenesspesticidesSchema = new mongoose.Schema({
  name: { type: String },
  category: { type: String },
  description: { type: String },
  image: { type: String },
  effectiveness_rating: { type: Number },
  safetyRating: { type: String },
  pest_targets: { type: Array },
  application_type: { type: String },
  usage_guide: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenesspesticides = mongoose.model('awarenesspesticides', awarenesspesticidesSchema);
