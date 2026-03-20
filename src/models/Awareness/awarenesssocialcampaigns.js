import mongoose from 'mongoose';

const awarenesssocialcampaignsSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  image: { type: String },
  status: { type: String },
  startDate: { type: Object },
  endDate: { type: Object },
  location: { type: String },
  participants: { type: Number },
  isHot: { type: Boolean },
  isActive: { type: Boolean },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenesssocialcampaigns = mongoose.model('awarenesssocialcampaigns', awarenesssocialcampaignsSchema);
