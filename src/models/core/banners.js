import mongoose from 'mongoose';

const bannersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Banners = mongoose.model('banners', bannersSchema);
