import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Users = mongoose.model('users', usersSchema);
