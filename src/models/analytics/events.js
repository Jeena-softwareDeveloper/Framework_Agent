import mongoose from 'mongoose';

const eventsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Events = mongoose.model('events', eventsSchema);
