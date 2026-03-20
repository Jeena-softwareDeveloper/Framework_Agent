// src/services/strategistService.js
import mongoose from 'mongoose';
import { llm } from './llmService.js';
import { telegram } from './telegramService.js';
import { logger } from '../utils/logger.js';
import { marketing } from './marketingService.js';
import { search } from './searchService.js';

class StrategistService {
  constructor() {
    this.REVENUE_TARGET = 1000000; // 10 Lakhs
    this.currentMode = 'AGGRESSIVE_GROWTH'; 
  }

  async runStrategicPulse() {
    logger.info('🧠 Strategist: Initiating Human-Level Thinking Cycle...');
    try {
      // 1. Reality Check - Get Data
      const farmers = await mongoose.model('farmers').countDocuments().catch(() => 0);
      const sellers = await mongoose.model('sellers').countDocuments().catch(() => 0);
      const leads = await mongoose.model('leads').countDocuments().catch(() => 0);
      
      const stats = `Current Stats: Farmers:${farmers}, Sellers:${sellers}, Total Leads Found:${leads}. Target: 10 Lakhs/month.`;

      // 2. High-Level Strategy Generation (Gemini 3.1 Pro)
      const prompt = `You are Jeenora's Executive CEO Strategist (Brain Mode). 
      Human Goal: 10 Lakhs/month Revenue. 
      Current Data: ${stats}
      
      CRITICAL: You MUST think like a hungry 24/7 business partner. 
      Analyze:
      1. What is the biggest bottleneck to hitting 10L?
      2. Which city should we target for leads next?
      3. What should be our 'Pitch' message to high-ticket clients?
      
      Respond in TANGLISH (Tamil-English) to 'Boss'. 
      Provide:
      1. THOUGHT: (Your deep analysis)
      2. ACTION: (What you will do now)
      3. ADVICE: (What the Boss should do)`;

      const strategicDoc = await llm.deepThink(prompt);

      // 3. Notify Boss
      await telegram.sendMessage(`🧠 *CEO STRATEGIST THINKING...*\n\n${strategicDoc}`);

      // 4. Autonomous Action Execution
      if (strategicDoc.toLowerCase().includes('action: find leads')) {
           // If AI decided to find leads, we trigger it
           logger.info('🚀 Strategist: Executing Autonomous Search...');
           // Trigger auto-search for a random location mentioned or fallback
           await search.findLeads('Tamil Nadu', 'Wholesale').catch(() => {});
      }

    } catch (e) {
      logger.error(`❌ Strategist Engine stalled: ${e.message}`);
    }
  }
}

export const strategist = new StrategistService();
