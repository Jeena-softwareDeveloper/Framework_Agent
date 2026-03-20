import mongoose from 'mongoose';

const applicationsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Applications = mongoose.model('applications', applicationsSchema);
