// dump_memory.js
import mongoose from 'mongoose';
import { connectDB } from './src/services/dbService.js';
import { chatHistory } from './src/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function dump() {
    await connectDB();
    const ModelStatsLog = mongoose.model('StatsLog');
    const snapshots = await ModelStatsLog.find().sort({ timestamp: -1 }).limit(3);
    
    console.log('\n--- DATABASE MEMORY (Snapshots) ---');
    console.log(JSON.stringify(snapshots, null, 2));

    console.log('\n--- CHAT MEMORY (History) ---');
    console.log('Current History Size:', Array.from(chatHistory.entries()).length);
    for (let [chatId, history] of chatHistory.entries()) {
        console.log(`ChatId: ${chatId}`);
        console.log(JSON.stringify(history, null, 2));
    }
    
    process.exit(0);
}

dump();
