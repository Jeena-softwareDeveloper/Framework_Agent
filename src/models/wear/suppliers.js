import mongoose from 'mongoose';

const suppliersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Suppliers = mongoose.model('suppliers', suppliersSchema);
