// src/models/core/statsLog.js
import mongoose from 'mongoose';

const statsLogSchema = new mongoose.Schema({
  farmers: Number,
  users: Number,
  sellers: Number,
  jobs: Number,
  products: Number,
  collections: Number,
  timestamp: { type: Date, default: Date.now }
});

export const StatsLog = mongoose.model('StatsLog', statsLogSchema);
