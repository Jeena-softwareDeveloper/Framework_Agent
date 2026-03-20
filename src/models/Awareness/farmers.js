import mongoose from 'mongoose';

const farmersSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  district: { type: String },
  crops: { type: Array },
  role: { type: String },
  points: { type: Number },
  consults: { type: Number },
  impactCore: { type: Number },
  postsCount: { type: Number },
  rank: { type: String },
  profileCompletion: { type: Number },
  language: { type: String },
  savedGuides: { type: Array },
  savedVideos: { type: Array },
  streak: { type: Object },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Farmers = mongoose.model('farmers', farmersSchema);
