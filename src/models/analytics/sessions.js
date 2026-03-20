import mongoose from 'mongoose';

const sessionsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Sessions = mongoose.model('sessions', sessionsSchema);
