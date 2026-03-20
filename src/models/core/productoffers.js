import mongoose from 'mongoose';

const productoffersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Productoffers = mongoose.model('productoffers', productoffersSchema);
