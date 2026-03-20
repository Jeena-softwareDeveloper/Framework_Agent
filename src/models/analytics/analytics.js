import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Analytics = mongoose.model('analytics', analyticsSchema);
