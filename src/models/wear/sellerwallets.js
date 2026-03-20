import mongoose from 'mongoose';

const sellerwalletsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Sellerwallets = mongoose.model('sellerwallets', sellerwalletsSchema);
