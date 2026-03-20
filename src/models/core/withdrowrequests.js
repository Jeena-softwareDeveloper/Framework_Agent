import mongoose from 'mongoose';

const withdrowrequestsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Withdrowrequests = mongoose.model('withdrowrequests', withdrowrequestsSchema);
