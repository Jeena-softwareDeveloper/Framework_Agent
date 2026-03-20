import mongoose from 'mongoose';

const wearbuyersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearbuyers = mongoose.model('wearbuyers', wearbuyersSchema);
