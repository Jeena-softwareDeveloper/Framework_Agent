import mongoose from 'mongoose';

const myshopwalletsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Myshopwallets = mongoose.model('myshopwallets', myshopwalletsSchema);
