import mongoose from 'mongoose';

const plansettingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Plansettings = mongoose.model('plansettings', plansettingsSchema);
