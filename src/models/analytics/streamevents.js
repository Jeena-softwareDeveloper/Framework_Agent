import mongoose from 'mongoose';

const streameventsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Streamevents = mongoose.model('streamevents', streameventsSchema);
