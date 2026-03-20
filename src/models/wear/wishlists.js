import mongoose from 'mongoose';

const wishlistsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wishlists = mongoose.model('wishlists', wishlistsSchema);
