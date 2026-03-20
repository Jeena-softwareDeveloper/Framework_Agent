import mongoose from 'mongoose';

const awarenesspointsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Awarenesspoints = mongoose.model('awarenesspoints', awarenesspointsSchema);
