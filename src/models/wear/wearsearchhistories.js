import mongoose from 'mongoose';

const wearsearchhistoriesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Wearsearchhistories = mongoose.model('wearsearchhistories', wearsearchhistoriesSchema);
