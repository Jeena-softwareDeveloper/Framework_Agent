import mongoose from 'mongoose';

const subscribersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Subscribers = mongoose.model('subscribers', subscribersSchema);
