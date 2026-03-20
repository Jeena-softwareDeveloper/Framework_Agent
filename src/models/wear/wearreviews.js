import mongoose from 'mongoose';

const wearreviewsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearreviews = mongoose.model('wearreviews', wearreviewsSchema);
