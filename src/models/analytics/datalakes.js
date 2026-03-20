import mongoose from 'mongoose';

const datalakesSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Datalakes = mongoose.model('datalakes', datalakesSchema);
