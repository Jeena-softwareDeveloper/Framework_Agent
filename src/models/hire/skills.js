import mongoose from 'mongoose';

const skillsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Skills = mongoose.model('skills', skillsSchema);
