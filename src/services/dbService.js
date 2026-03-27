// src/services/dbService.js
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

const leadSchema = new mongoose.Schema({
  title: String,
  phone: String,
  website: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

const vaultSchema = new mongoose.Schema({
  service: { type: String, unique: true }, // e.g: 'linkedin', 'facebook'
  username: String,
  password: { type: String }, // Store secure Boss!
  updatedAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export const Vault = mongoose.models.Vault || mongoose.model('Vault', vaultSchema);

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    logger.success('Connected to MongoDB 🍃');
  } catch (e) {
    logger.error(`MongoDB connection failed: ${e.message}`);
  }
};
