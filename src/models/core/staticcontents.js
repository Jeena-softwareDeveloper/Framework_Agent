import mongoose from 'mongoose';

const staticcontentsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Staticcontents = mongoose.model('staticcontents', staticcontentsSchema);
