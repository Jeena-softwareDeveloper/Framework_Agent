import mongoose from 'mongoose';

const addressesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Addresses = mongoose.model('addresses', addressesSchema);
