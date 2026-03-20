import mongoose from 'mongoose';

const seller_admin_messagesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Seller_admin_messages = mongoose.model('seller_admin_messages', seller_admin_messagesSchema);
