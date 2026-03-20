import mongoose from 'mongoose';

const tokenblacklistsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Tokenblacklists = mongoose.model('tokenblacklists', tokenblacklistsSchema);
