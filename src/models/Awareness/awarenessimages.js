import mongoose from 'mongoose';

const awarenessimagesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Awarenessimages = mongoose.model('awarenessimages', awarenessimagesSchema);
