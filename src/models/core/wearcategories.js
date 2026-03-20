import mongoose from 'mongoose';

const wearcategoriesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearcategories = mongoose.model('wearcategories', wearcategoriesSchema);
