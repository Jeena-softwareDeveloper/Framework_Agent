import mongoose from 'mongoose';

const subscribercategoriesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Subscribercategories = mongoose.model('subscribercategories', subscribercategoriesSchema);
