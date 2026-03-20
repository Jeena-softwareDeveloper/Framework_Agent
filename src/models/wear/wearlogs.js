import mongoose from 'mongoose';

const wearlogsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearlogs = mongoose.model('wearlogs', wearlogsSchema);
