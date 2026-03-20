// test_analyze_final.js
import mongoose from 'mongoose';
import { loadModels } from './src/models/index.js';
import { connectDB } from './src/services/dbService.js';
import { llm } from './src/services/llmService.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('Connecting...');
    await connectDB();
    console.log('Loading models...');
    await loadModels();
    
    console.log('Running analysis...');
    const stats = {
        farmers: await mongoose.model('farmers').countDocuments(),
        users: await mongoose.model('users').countDocuments(),
        sellers: await mongoose.model('sellers').countDocuments(),
        jobs: await mongoose.model('jobs').countDocuments(),
        products: await mongoose.model('products').countDocuments(),
        collections: (await mongoose.connection.db.listCollections().toArray()).length
    };

    const prompt = `Analyze this database data for the Jeenora platform. State which module has few users and suggest where we need more advertising or growth. Data: ${JSON.stringify(stats)}. Format as a professional business strategy.`;
    
    try {
        const analysis = await llm.deepThink(prompt);
        fs.writeFileSync('analysis_result.txt', analysis);
        console.log('✅ Success! Analysis saved to analysis_result.txt');
    } catch (e) {
        console.error('❌ Analysis failed:', e.message);
    }
    
    process.exit(0);
}

test();
