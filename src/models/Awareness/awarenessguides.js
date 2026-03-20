import mongoose from 'mongoose';

const awarenessguidesSchema = new mongoose.Schema({
  category: { type: Object },
  heading: { type: String },
  slug: { type: String },
  level: { type: String },
  difficulty: { type: String },
  description: { type: String },
  content: { type: String },
  steps: { type: Array },
  maintenance: { type: Array },
  troubleshooting: { type: Array },
  benefits: { type: Array },
  readTime: { type: String },
  districts: { type: Array },
  crops: { type: Array },
  isActive: { type: Boolean },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenessguides = mongoose.model('awarenessguides', awarenessguidesSchema);
