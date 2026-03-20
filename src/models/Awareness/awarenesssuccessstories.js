import mongoose from 'mongoose';

const awarenesssuccessstoriesSchema = new mongoose.Schema({
  heading: { type: String },
  slug: { type: String },
  description: { type: String },
  name: { type: String },
  area: { type: String },
  experience: { type: String },
  image: { type: String },
  isActive: { type: Boolean },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenesssuccessstories = mongoose.model('awarenesssuccessstories', awarenesssuccessstoriesSchema);
