import mongoose from 'mongoose';

const wearnotificationsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearnotifications = mongoose.model('wearnotifications', wearnotificationsSchema);
