import mongoose from 'mongoose';

const otpsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Otps = mongoose.model('otps', otpsSchema);
