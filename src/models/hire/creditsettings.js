import mongoose from 'mongoose';

const creditsettingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Creditsettings = mongoose.model('creditsettings', creditsettingsSchema);
