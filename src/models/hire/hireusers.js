import mongoose from 'mongoose';

const hireusersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Hireusers = mongoose.model('hireusers', hireusersSchema);
