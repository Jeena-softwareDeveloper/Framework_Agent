import mongoose from 'mongoose';

const sellersSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String },
  status: { type: String },
  payment: { type: String },
  method: { type: String },
  image: { type: String },
  permissions: { type: Array },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Sellers = mongoose.model('sellers', sellersSchema);
