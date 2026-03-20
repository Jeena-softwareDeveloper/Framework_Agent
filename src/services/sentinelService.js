// src/services/sentinelService.js
import mongoose from 'mongoose';
import { competitor as auditor } from './competitorService.js';
import { telegram } from './telegramService.js';
import { logger } from '../utils/logger.js';

class SentinelService {
  async runGlobalWatch() {
    logger.info('🔦 Sentinel: Starting 24/7 Competitor Watch...');
    try {
      const CompetitorModel = mongoose.model('competitors');
      const list = await CompetitorModel.find({ status: 'active' });
      
      for (const comp of list) {
        logger.info(`🔦 Sentinel: Auditing ${comp.url}...`);
        const report = await auditor.analyzeCompetitor(comp.url);
        
        // Update last audit time
        comp.lastAudit = new Date();
        await comp.save();

        // Notify Boss
        await telegram.sendMessage(`🔦 *SENTINEL ALERT:* \nI just scanned your competitor **${comp.name}** (${comp.url}). \n\n${report.slice(0, 3000)}`);
      }
    } catch (e) {
      logger.error(`❌ Sentinel failed: ${e.message}`);
    }
  }
}

export const sentinel = new SentinelService();
