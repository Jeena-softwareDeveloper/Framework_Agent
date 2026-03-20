import mongoose from 'mongoose';

const pagesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Pages = mongoose.model('pages', pagesSchema);
