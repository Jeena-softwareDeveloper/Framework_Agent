import mongoose from 'mongoose';

const campaignsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Campaigns = mongoose.model('campaigns', campaignsSchema);
