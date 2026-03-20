import mongoose from 'mongoose';

const awarenessaccountsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Awarenessaccounts = mongoose.model('awarenessaccounts', awarenessaccountsSchema);
