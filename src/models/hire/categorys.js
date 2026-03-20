import mongoose from 'mongoose';

const categorysSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Categorys = mongoose.model('categorys', categorysSchema);
