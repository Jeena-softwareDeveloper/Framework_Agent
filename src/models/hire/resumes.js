import mongoose from 'mongoose';

const resumesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Resumes = mongoose.model('resumes', resumesSchema);
