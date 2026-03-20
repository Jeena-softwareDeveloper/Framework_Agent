import mongoose from 'mongoose';

const wearoffercampaignsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearoffercampaigns = mongoose.model('wearoffercampaigns', wearoffercampaignsSchema);
