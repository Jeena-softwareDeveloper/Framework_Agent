import mongoose from 'mongoose';

const couponsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Coupons = mongoose.model('coupons', couponsSchema);
