import mongoose from 'mongoose';

const notificationsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Notifications = mongoose.model('notifications', notificationsSchema);
