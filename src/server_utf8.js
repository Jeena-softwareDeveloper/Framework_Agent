// src/index.js
import express from 'express';
import mongoose from 'mongoose';
import { logger } from './utils/logger.js';
import { validateEnv, ENV } from './config/env.js';
import { telegram } from './services/telegramService.js';
import { connectDB, Lead } from './services/dbService.js';
import { loadModels } from './models/index.js';
import { startScheduler } from './autonomous/scheduler.js';
import { CEOOrchestrator } from './autonomous/orchestrator.js';
import { llm } from './services/llmService.js';
import { search } from './services/searchService.js';
import { marketing } from './services/marketingService.js';
import { competitor } from './services/competitorService.js';
import { HUMAN_PERSONA } from './config/constants.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = ENV.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Memory Maps
export const userStates = new Map();
export const chatHistory = new Map();

// API for Dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
        farmers: await mongoose.model('farmers').countDocuments().catch(() => 0),
        users: await mongoose.model('users').countDocuments().catch(() => 0),
        products: await mongoose.model('products').countDocuments().catch(() => 0),
        total_leads: await mongoose.model('leads').countDocuments().catch(() => 0),
        collections: (await mongoose.connection.db.listCollections().toArray().catch(() => [])).length
    };
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// The Unified Mega Command Hub
export async function handleUserInput(input, respond) {
  try {
    const trimmedInput = input.trim();
    if (trimmedInput.toLowerCase() === 'exit') return 'exit';

    const lowInput = trimmedInput.toLowerCase();
    const chatId = 'current'; 
    const state = userStates.get(chatId) || { stage: 'none' };
    
    // History
    let history = chatHistory.get(chatId) || [];
    history.push({ role: 'user', content: trimmedInput });
    if (history.length > 10) history.shift();
    chatHistory.set(chatId, history);

    // 1. Contextual States (Search etc)
    if (state.stage === 'awaiting_location') {
      const location = trimmedInput;
      await respond(`ðŸ” *CEO Search:* Finding leads in *${location}* Boss...`);
      const results = await search.findLeads(location, 'Business');
      let msg = `âœ… Found ${results.length} leads in *${location}* Boss:\n\n`;
      results.forEach(l => {
        msg += `â€¢ *${l.title}*\n  ðŸ“ž ${l.phone || 'N/A'}\n  ðŸŒ ${l.website || 'N/A'}\n\n`;
        new Lead({ title: l.title, phone: l.phone, website: l.website, location }).save().catch(() => {});
      });
      userStates.set(chatId, { stage: 'none' });
      return msg;
    }

    // 2. Trigger Regex
    const isStaticPage = /static page|website|lead/i.test(lowInput);
    const isDatabaseMode = /database|collection|view|analyze|strategy|business|autonomous|ceo|spy|pitch|sentinel/i.test(lowInput);

    if (isStaticPage) {
      userStates.set(chatId, { stage: 'awaiting_location' });
      return 'I can jump on that immediately Boss. **Endha area-la leads thedanum?**';
    }

    if (isDatabaseMode) {
        if (lowInput.includes('collection')) {
          const db = mongoose.connection.db;
          const cols = await db.listCollections().toArray();
          return `ðŸ“‚ *Database Collections:* \n${cols.map(c => `â€¢ ${c.name}`).join('\n')}`;
        }

        if (lowInput.startsWith('view ')) {
          const colName = lowInput.split(' ')[1];
          try {
            const Model = mongoose.model(colName);
            const data = await Model.find().sort({ createdAt: -1 }).limit(3);
            let msg = `ðŸ“Š *Audit Report for ${colName} Boss:*\n\n`;
            data.forEach((d, i) => msg += `ðŸ“ Entry ${i+1}:\n\`\`\`json\n${JSON.stringify(d, null, 2).slice(0, 500)}\n\`\`\`\n\n`);
            return msg;
          } catch (e) { return `âŒ Module *${colName}* kandupidikka mudiyala Boss.`; }
        }

        if (lowInput.startsWith('spy ')) {
          const url = (trimmedInput.split(' ')[1] || '').trim();
          await respond(`ðŸ•µï¸â€â™‚ï¸ *CEO Intelligence:* Searching competitor strategy at ${url}...`);
          return await competitor.analyzeCompetitor(url);
        }

        if (lowInput.startsWith('pitch ')) {
            const parts = trimmedInput.split(' ');
            const target = parts[1];
            const msg = parts.slice(2).join(' ');
            await respond(`âœ‰ï¸ *Outreach:* Pitching your service to ${target} Boss...`);
            await marketing.sendEmail(target, msg);
            return `Pitch sent successfully to ${target}, Boss!`;
        }

        if (lowInput.startsWith('sentinel add ')) {
            const url = (trimmedInput.split(' ')[2] || '').trim();
            const CompetitorModel = mongoose.model('competitors');
            await new CompetitorModel({ name: url.split('.')[0] || 'Unknown', url }).save();
            return `Boss, I added **${url}** to my daily watchdog sentinel. ðŸ•µï¸â€â™‚ï¸ðŸ›¡ï¸`;
        }

        if (lowInput.includes('analyze') || lowInput.includes('strategy') || lowInput.includes('autonomous')) {
          await respond('ðŸ§  *CEO Analysis:* Deep thinking about business health Boss...');
          await CEOOrchestrator.runDailyAnalysis();
          return 'Strategic analysis report and autonomous actions are triggered. Check Telegram Boss!';
        }
    }

    // 3. Default AI Conversation (Tanglish Boss Mode)
    const prompt = `${HUMAN_PERSONA}\nHistory: ${JSON.stringify(history)}\nCommand: "${trimmedInput}"`;
    const res = await llm.deepThink(prompt);
    history.push({ role: 'assistant', content: res });
    return res;

  } catch (e) {
    logger.error(`Error in Hub: ${e.message}`);
    return `ðŸ›¡ï¸ *SYSTEM:* Boss, snag: "${e.message}". I've reset focus. Ready Boss!`;
  }
}

async function start() {
  validateEnv();
  await connectDB();
  await loadModels();
  startScheduler();

  if (ENV.TELEGRAM_BOT_TOKEN) {
    telegram.initListener(handleUserInput);
  }

  app.listen(port, () => {
    logger.info(`ðŸš€ Jeenora Dashboard Active at http://localhost:${port}`);
    logger.info('âœ” Mega Hub Agent (Boss Bot) Live ðŸš€');
  });
}

start();
