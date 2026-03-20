import mongoose from 'mongoose';

const customerordersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Customerorders = mongoose.model('customerorders', customerordersSchema);
