import mongoose from 'mongoose';

const homecontentsSchema = new mongoose.Schema({
  sectionKey: { type: String },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  cards: { type: Array },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Homecontents = mongoose.model('homecontents', homecontentsSchema);
