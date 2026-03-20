// src/models/core/competitor.js
import mongoose from 'mongoose';

const competitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  lastAudit: { type: Date },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export const Competitor = mongoose.model('competitors', competitorSchema);
