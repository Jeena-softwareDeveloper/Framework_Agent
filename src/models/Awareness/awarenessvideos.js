import mongoose from 'mongoose';

const awarenessvideosSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Awarenessvideos = mongoose.model('awarenessvideos', awarenessvideosSchema);
