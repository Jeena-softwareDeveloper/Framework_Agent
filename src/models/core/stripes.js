import mongoose from 'mongoose';

const stripesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Stripes = mongoose.model('stripes', stripesSchema);
