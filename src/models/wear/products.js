import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Products = mongoose.model('products', productsSchema);
