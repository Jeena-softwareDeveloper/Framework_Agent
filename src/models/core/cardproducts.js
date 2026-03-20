import mongoose from 'mongoose';

const cardproductsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Cardproducts = mongoose.model('cardproducts', cardproductsSchema);
