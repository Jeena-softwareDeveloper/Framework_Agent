import mongoose from 'mongoose';

const chatsupportticketsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Chatsupporttickets = mongoose.model('chatsupporttickets', chatsupportticketsSchema);
