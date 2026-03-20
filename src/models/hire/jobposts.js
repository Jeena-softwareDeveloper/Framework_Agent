import mongoose from 'mongoose';

const jobpostsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Jobposts = mongoose.model('jobposts', jobpostsSchema);
