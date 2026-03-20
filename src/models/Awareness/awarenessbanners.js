import mongoose from 'mongoose';

const awarenessbannersSchema = new mongoose.Schema({
  title: { type: String },
  slug: { type: String },
  description: { type: String },
  image: { type: String },
  startDate: { type: Object },
  clickCount: { type: Number },
  isActive: { type: Boolean },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenessbanners = mongoose.model('awarenessbanners', awarenessbannersSchema);
