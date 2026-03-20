import mongoose from 'mongoose';

const awarenesstickersSchema = new mongoose.Schema({
  text: { type: String },
  type: { type: String },
  link: { type: String },
  isActive: { type: Boolean },
  startDate: { type: Object },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenesstickers = mongoose.model('awarenesstickers', awarenesstickersSchema);
