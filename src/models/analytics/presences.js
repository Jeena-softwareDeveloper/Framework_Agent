import mongoose from 'mongoose';

const presencesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Presences = mongoose.model('presences', presencesSchema);
