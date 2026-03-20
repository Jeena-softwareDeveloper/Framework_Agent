import mongoose from 'mongoose';

const wearauditlogsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearauditlogs = mongoose.model('wearauditlogs', wearauditlogsSchema);
