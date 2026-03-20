import mongoose from 'mongoose';

const seller_customersSchema = new mongoose.Schema({
  myId: { type: String },
  myFriends: { type: Array },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Seller_customers = mongoose.model('seller_customers', seller_customersSchema);
