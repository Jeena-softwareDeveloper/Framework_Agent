import mongoose from 'mongoose';

const predictionsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Predictions = mongoose.model('predictions', predictionsSchema);
