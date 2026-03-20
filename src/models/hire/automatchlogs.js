import mongoose from 'mongoose';

const automatchlogsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Automatchlogs = mongoose.model('automatchlogs', automatchlogsSchema);
