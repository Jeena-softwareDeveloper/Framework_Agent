import mongoose from 'mongoose';

const resumerequestsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Resumerequests = mongoose.model('resumerequests', resumerequestsSchema);
