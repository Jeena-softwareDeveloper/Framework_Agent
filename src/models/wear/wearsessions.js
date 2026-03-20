import mongoose from 'mongoose';

const wearsessionsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearsessions = mongoose.model('wearsessions', wearsessionsSchema);
