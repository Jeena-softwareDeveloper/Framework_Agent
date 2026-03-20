import mongoose from 'mongoose';

const resumeeditorsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Resumeeditors = mongoose.model('resumeeditors', resumeeditorsSchema);
