// src/models/core/revenueLog.js
import mongoose from 'mongoose';

const revenueLogSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  source: { type: String, default: 'General' },
  month: { type: String, required: true }, // e.g., 'March 2026'
  createdAt: { type: Date, default: Date.now }
});

export const RevenueLog = mongoose.model('revenue_logs', revenueLogSchema);
