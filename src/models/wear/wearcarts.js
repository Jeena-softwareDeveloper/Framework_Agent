import mongoose from 'mongoose';

const wearcartsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearcarts = mongoose.model('wearcarts', wearcartsSchema);
