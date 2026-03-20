import mongoose from 'mongoose';

const funnelsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Funnels = mongoose.model('funnels', funnelsSchema);
