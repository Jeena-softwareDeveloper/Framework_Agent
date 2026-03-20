import mongoose from 'mongoose';

const paymentsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Payments = mongoose.model('payments', paymentsSchema);
