import mongoose from 'mongoose';

const jobsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Jobs = mongoose.model('jobs', jobsSchema);
