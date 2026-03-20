import mongoose from 'mongoose';

const wearbannersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearbanners = mongoose.model('wearbanners', wearbannersSchema);
