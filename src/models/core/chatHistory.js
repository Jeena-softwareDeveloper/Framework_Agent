// src/models/core/chatHistory.js
import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

export const ChatHistory = mongoose.model('chat_histories', chatHistorySchema);
