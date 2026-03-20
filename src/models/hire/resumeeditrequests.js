import mongoose from 'mongoose';

const resumeeditrequestsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Resumeeditrequests = mongoose.model('resumeeditrequests', resumeeditrequestsSchema);
