import mongoose from 'mongoose';

const locationsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Locations = mongoose.model('locations', locationsSchema);
