import mongoose from 'mongoose';

const seller_customer_msgsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Seller_customer_msgs = mongoose.model('seller_customer_msgs', seller_customer_msgsSchema);
