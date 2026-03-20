import mongoose from 'mongoose';

const wear_wishlistsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wear_wishlists = mongoose.model('wear_wishlists', wear_wishlistsSchema);
