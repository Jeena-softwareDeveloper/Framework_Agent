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

export const Lead = mongoose.model('Lead', leadSchema);

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    logger.success('Connected to MongoDB 🍃');
  } catch (e) {
    logger.error(`MongoDB connection failed: ${e.message}`);
  }
};
