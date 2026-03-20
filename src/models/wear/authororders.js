import mongoose from 'mongoose';

const authorordersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Authororders = mongoose.model('authororders', authorordersSchema);
