import mongoose from 'mongoose';

const wearotpsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearotps = mongoose.model('wearotps', wearotpsSchema);
