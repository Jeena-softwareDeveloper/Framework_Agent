import mongoose from 'mongoose';

const emailtemplatesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Emailtemplates = mongoose.model('emailtemplates', emailtemplatesSchema);
