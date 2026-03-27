import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  role: { type: String, enum: ['user', 'model'], required: true },
  parts: [{
    text: String,
    functionCall: Object,
    functionResponse: Object
  }],
  timestamp: { type: Date, default: Date.now },
});

// Indexing for faster retrieval
chatLogSchema.index({ chatId: 1, timestamp: -1 });

export const ChatLog = mongoose.models.ChatLog || mongoose.model('ChatLog', chatLogSchema);
