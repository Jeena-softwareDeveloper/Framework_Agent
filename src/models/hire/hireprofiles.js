import mongoose from 'mongoose';

const hireprofilesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Hireprofiles = mongoose.model('hireprofiles', hireprofilesSchema);
