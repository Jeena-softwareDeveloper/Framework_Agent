// src/server.js
import express from 'express';
import { logger } from './utils/logger.js';
import { validateEnv, ENV } from './config/env.js';
import { telegram } from './services/telegramService.js';
import { connectDB } from './services/dbService.js';
import { loadModels } from './models/index.js';
import { startScheduler } from './autonomous/scheduler.js';
import { handleUserInput } from './bot/handler.js';
import apiRoutes from './routes/api.js';

const app = express();
const port = ENV.PORT || 3000;

// ----- Middlewares -----
app.use(express.static('public'));
app.use(express.json());

// ----- API Routes -----
app.use('/api', apiRoutes);

// ----- Application Startup -----
async function start() {
  try {
    logger.info('🚀 Starting Mega Hub Agent Server...');

    // 🔐 Step 1: Validate Environment Vars
    validateEnv();

    // 🗄️ Step 2: Database Connection
    await connectDB();

    // 🏗️ Step 3: Load Data Models (Jeenora Agri, Hire, Wear etc.)
    await loadModels();

    // 🤖 Step 4: Start Autonomous Processes (Only if enabled Boss!)
    if (ENV.AUTONOMOUS_ENABLED) {
      startScheduler();
      logger.info('✔ Scheduler & Autonomous Orchestrator Ready.');
    } else {
      logger.warn('⚠ Autonomous mode is DISABLED. Tasks will only run with your permission Boss!');
    }

    // 💬 Step 5: Initialize Telegram Interaction
    if (ENV.TELEGRAM_BOT_TOKEN) {
      // Inject telegram into search service to enable live log streaming Boss!
      const { search } = await import('./services/searchService.js');
      search.setTelegram(telegram);

      telegram.initListener(handleUserInput);
      logger.info('✔ Telegram Bot Listener Active.');
    } else {
      logger.warn('[WARNING] TELEGRAM_BOT_TOKEN missing. Bot is dormant.');
    }

    // 🌐 Step 6: Start HTTP Server for Dashboard
    app.listen(port, () => {
      logger.info(`🚀 Jeenora Dashboard Active at http://localhost:${port}`);
      logger.info('✔ Mega Hub Agent (Boss Bot) is Online! 🛡️');
    });

  } catch (error) {
    logger.error(`❌ Critical Server Start Failure: ${error.message}`);
    process.exit(1);
  }
}

// Kickoff
start();
