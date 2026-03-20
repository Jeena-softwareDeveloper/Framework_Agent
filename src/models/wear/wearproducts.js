import mongoose from 'mongoose';

const wearproductsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearproducts = mongoose.model('wearproducts', wearproductsSchema);
