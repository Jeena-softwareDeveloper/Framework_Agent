// src/autonomous/scheduler.js
import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import { CEOOrchestrator } from './orchestrator.js';
import { sentinel } from '../services/sentinelService.js';
import { strategist } from '../services/strategistService.js';

export const startScheduler = () => {
  logger.info('🕰️ Autonomous CEO Scheduler Started!');
  
  // 1. Every 24 hours at 10 AM (Daily CEO Report)
  cron.schedule('0 10 * * *', async () => {
    logger.info('⏰ Scheduled Daily Business Health Check triggered...');
    await CEOOrchestrator.runDailyAnalysis();
  });

  // 2. Critical Alert Check every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('🔦 Regular Business Growth Check triggered...');
    await CEOOrchestrator.checkCriticalAlerts();
  });

  // 4. Sentinel Competitor Watch (Every 12 hours)
  cron.schedule('0 */12 * * *', async () => {
    logger.info('🔦 Sentinel Watch: Auto-scanning competitors...');
    await sentinel.runGlobalWatch();
  });

  // 3. Test Task (Runs every 10 minutes to show it's alive in logs)
  cron.schedule('*/10 * * * *', () => {
    logger.info('ℹ 💓 CEO Heartbeat: Automation Engine active. Boss, ellam regular ah scan aiteythana iruku!');
  });
};
