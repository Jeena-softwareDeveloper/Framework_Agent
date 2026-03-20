import mongoose from 'mongoose';

const reviewsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Reviews = mongoose.model('reviews', reviewsSchema);
