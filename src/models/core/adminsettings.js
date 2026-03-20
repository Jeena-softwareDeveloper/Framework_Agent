import mongoose from 'mongoose';

const adminsettingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Adminsettings = mongoose.model('adminsettings', adminsettingsSchema);
