import mongoose from 'mongoose';

const adminsSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  image: { type: String },
  role: { type: String },
}, { timestamps: true });

export const Admins = mongoose.model('admins', adminsSchema);
