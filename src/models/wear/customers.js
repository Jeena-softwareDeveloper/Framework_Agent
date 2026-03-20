import mongoose from 'mongoose';

const customersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Customers = mongoose.model('customers', customersSchema);
