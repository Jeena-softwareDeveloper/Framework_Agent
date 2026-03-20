import mongoose from 'mongoose';

const loginattemptsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Loginattempts = mongoose.model('loginattempts', loginattemptsSchema);
