// src/bot/handler.js
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { Lead } from '../services/dbService.js';
import { llm } from '../services/llmService.js';
import { search } from '../services/searchService.js';
import { marketing } from '../services/marketingService.js';
import { competitor } from '../services/competitorService.js';
import { CEOOrchestrator } from '../autonomous/orchestrator.js';
import { community } from '../services/communityService.js';
import { HUMAN_PERSONA } from '../config/constants.js';
import { userStates, chatHistory } from './state.js';

/**
 * Main Command Hub for processing user input across Telegram & Web Dashboard
 */
export async function handleUserInput(input, respond, chatId = 'current', onStream = null) {
  try {
    const trimmedInput = input.trim();
    if (trimmedInput.toLowerCase() === 'exit') return 'exit';

    const lowInput = trimmedInput.toLowerCase();
    const state = userStates.get(chatId) || { stage: 'none' };
    
    // 1. Contextual State Handling (e.g., Search Stage)
    if (state.stage === 'awaiting_location') {
      const location = trimmedInput;
      await respond(`🔍 *CEO Search:* Finding leads in *${location}* Boss...`);
      const results = await search.findLeads(location, 'Business');
      
      let msg = `✅ Found ${results.length} leads in *${location}* Boss:\n\n`;
      results.forEach(l => {
        msg += `• *${l.title}*\n  📞 ${l.phone || 'N/A'}\n  🌐 ${l.website || 'N/A'}\n\n`;
        new Lead({ title: l.title, phone: l.phone, website: l.website, location }).save().catch(() => {});
      });
      
      userStates.set(chatId, { stage: 'none' });
      return msg;
    }

    // 2. Command Trigger Logic
    const isSearchRequest = /static page|website|lead/i.test(lowInput);
    const isSystemCmd = /database|collection|view|analyze|strategy|business|autonomous|ceo|spy|pitch|sentinel|market|community/i.test(lowInput);
    const isMarketAnalysis = /analyze market|market study|community analysis/i.test(lowInput);

    // 🛡️ TOP-LEVEL COMMAND: DeepSeek Login Integration
    if (lowInput.startsWith('/login_ds')) {
        const parts = trimmedInput.split(/\s+/);
        if (parts.length < 3) return "❌ Boss, login correct-ah kudunga: `/login_ds <username> <password>`";
        
        // Sanitize: Remove < > brackets if user included them Boss!
        const username = parts[1].replace(/[<>]/g, '');
        const password = parts[2].replace(/[<>]/g, '');
        
        const { Vault } = await import('../services/dbService.js');
        await Vault.findOneAndUpdate({ service: 'deepseek' }, { username, password }, { upsert: true });

        // 🚀 IMMEDIATE MISSION: Automated Login Boss!
        await respond("✔ *Credentials Saved:* Initializing automated DeepSeek login mission Boss... 🛡️🌍🧠");
        
        try {
            const { browser } = await import('../services/browserService.js');
            const { deepSeek } = await import('../services/deepSeekService.js');
            
            await browser.init();
            await deepSeek.handleLogin(browser.page);
            
            return "✔ *Login Success:* Cloud Brain is now AUTHENTICATED. Session saved and ready for missions Boss! 🛡️💎💰🚀";
        } catch (err) {
            return `❌ *Login Snag:* "${err.message}". Please check your credentials Boss!`;
        }
    }

    if (isSearchRequest) {
      userStates.set(chatId, { stage: 'awaiting_location' });
      return 'I can jump on that immediately Boss. **Endha area-la leads thedanum?**';
    }

    if (isMarketAnalysis) {
      await respond('🔍 *CEO Intelligence:* Analyzing market trends and community needs Boss...');
      return await community.analyzeMarketAndGeneratePost();
    }

    if (isSystemCmd) {
        // Database Collections view
        if (lowInput.includes('collection')) {
          const db = mongoose.connection.db;
          const cols = await db.listCollections().toArray();
          return `📂 *Database Collections:* \n${cols.map(c => `• ${c.name}`).join('\n')}`;
        }

        // View specific collection data
        if (lowInput.startsWith('view ')) {
          const colName = lowInput.split(' ')[1];
          try {
            const Model = mongoose.model(colName);
            const data = await Model.find().sort({ createdAt: -1 }).limit(3);
            let msg = `📊 *Audit Report for ${colName} Boss:*\n\n`;
            data.forEach((d, i) => msg += `📌 Entry ${i+1}:\n\`\`\`json\n${JSON.stringify(d, null, 2).slice(0, 500)}\n\`\`\`\n\n`);
            return msg;
          } catch (e) { 
            return `❌ Module *${colName}* kandupidikka mudiyala Boss.`; 
          }
        }

        // Competitor Spying
        if (lowInput.startsWith('spy ')) {
          const url = (trimmedInput.split(' ')[1] || '').trim();
          await respond(`🕵️‍♂️ *CEO Intelligence:* Searching competitor strategy at ${url}...`);
          return await competitor.analyzeCompetitor(url);
        }

        // Email Pitching
        if (lowInput.startsWith('pitch ')) {
            const parts = trimmedInput.split(' ');
            const target = parts[1];
            const msg = parts.slice(2).join(' ');
            await respond(`✉️ *Outreach:* Pitching your service to ${target} Boss...`);
            await marketing.sendEmail(target, msg);
            return `Pitch sent successfully to ${target}, Boss!`;
        }

        // Add to Sentinel Watchdog
        if (lowInput.startsWith('sentinel add ')) {
            const url = (trimmedInput.split(' ')[2] || '').trim();
            const CompetitorModel = mongoose.model('competitors');
            await new CompetitorModel({ name: url.split('.')[0] || 'Unknown', url }).save();
            return `Boss, I added **${url}** to my daily watchdog sentinel. 🕵️‍♂️🛡️`;
        }

        // Trigger Autonomous Analysis
        if (lowInput.includes('analyze') || lowInput.includes('strategy') || lowInput.includes('autonomous')) {
          await respond('🧠 *CEO Analysis:* Deep thinking about business health Boss...');
          await CEOOrchestrator.runDailyAnalysis();
          return 'Strategic analysis report and autonomous actions are triggered. Check Telegram Boss!';
        }
    }

    // 3. Default AI Conversation (Antigravity CEO Mode)
    return await llm.deepThink(trimmedInput, 1, chatId, onStream);

  } catch (e) {
    logger.error(`Error in Command Hub: ${e.message}`);
    return `🛡️ *SYSTEM:* Boss, snag: "${e.message}". I've reset focus. Ready Boss!`;
  }
}
