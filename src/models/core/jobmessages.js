import mongoose from 'mongoose';

const jobmessagesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Jobmessages = mongoose.model('jobmessages', jobmessagesSchema);
