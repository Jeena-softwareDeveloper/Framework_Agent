// src/services/competitorService.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { llm } from './llmService.js';
import { logger } from '../utils/logger.js';
import { HUMAN_PERSONA } from '../config/constants.js';

class CompetitorService {
  async analyzeCompetitor(url) {
    logger.info(`🕵️‍♂️ CEO Deep Audit: Analyzing ${url}...`);
    try {
      // Ensure URL has protocol
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const resp = await axios.get(targetUrl, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(resp.data);

      const title = $('title').text();
      const metaDesc = $('meta[name="description"]').attr('content') || 'None';
      const h1Count = $('h1').length;
      const images = $('img').length;
      const scripts = $('script').length;
      const links = $('a').length;

      const prompt = `Boss, I am doing a Deep A-to-Z Audit of ${targetUrl} now. 
      Act as Jeenora's Executive CEO Auditor. ${HUMAN_PERSONA}
      
      Fetched Website Specs:
      - Title: ${title}
      - Meta: ${metaDesc}
      - H1: ${h1Count}, Images: ${images}, Scripts: ${scripts}.
      - Content Snippet: ${$.text().slice(0, 2000)}
      
      CRITICAL: You must provide a highly technical Audit Report in TANGLISH.
      Follow these sections exactly:
      1. SEO Health Audit (Meta tags, keywords, titles check panni sollu Boss).
      2. Security & Scripts Audit (HTTPS, too many plugins, security risks).
      3. UI/UX Score (Modern ah iruka? Professional feel iruka?).
      4. Competitive Strategy (Intha sites-ai thorkadikka Jeenora ena panalum Boss?).
      5. Final Verdict (Audit Summary).`;

      const analysis = await llm.deepThink(prompt);
      return analysis;
    } catch (e) {
      throw new Error(`Deep Audit failed for ${url}: ${e.message}`);
    }
  }
}

export const competitor = new CompetitorService();
