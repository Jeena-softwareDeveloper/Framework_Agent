import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger.js';
import { llm } from './llmService.js';

class AdvancedSearchService {
  constructor() {
    this.telegram = null;
    this.logMessages = [];
  }

  setTelegram(telegramInstance) {
    this.telegram = telegramInstance;
  }

  async sendUpdate(text) {
    if (this.telegram) {
      const msg = await this.telegram.sendMessage(text).catch(() => null);
      if (msg && msg.message_id) this.logMessages.push(msg.message_id);
    }
  }

  async cleanupLogs() {
    if (this.telegram) {
      for (const id of this.logMessages) {
        await this.telegram.deleteMessage(id);
      }
      this.logMessages = [];
    }
  }

  async searchNative(query) {
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const $ = cheerio.load(data);
      const results = [];
      $('.result__body').each((i, el) => {
        if (i < 15) { // Collecting 15 links for deeper reach
          const title = $(el).find('.result__title').text().trim();
          let link = $(el).find('.result__a').attr('href');
          if (link && link.startsWith('//')) link = 'https:' + link;
          if (link && !link.startsWith('http')) link = 'https://duckduckgo.com' + link;
          const snippet = $(el).find('.result__snippet').text().trim();
          results.push({ title, link, snippet });
        }
      });
      return results;
    } catch (e) {
      return [];
    }
  }

  async crawlUrl(url) {
    try {
      const { data } = await axios.get(url, { 
        timeout: 6000, 
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      const $ = cheerio.load(data);
      $('script, style, nav, footer, header, aside').remove();
      return $('body').text().replace(/\s+/g, ' ').trim().substring(0, 4000);
    } catch (e) {
      return "";
    }
  }

  /**
   * THE ULTIMATE RESEARCH ENGINE: 
   * MULTI-STAGE BROWSING & FULL PREPARATION
   */
  async deepSearch(query) {
    logger.info(`🔥 EXECUTING DEEP RESEARCH: ${query}`);
    this.logMessages = [];
    await this.sendUpdate(`🔍 *INITIATING COMPREHENSIVE RESEARCH:* "${query}"`);

    // 1. STAGE 1: BROAD SEARCH
    let searchResults = await this.searchNative(query);
    if (searchResults.length === 0) return "❌ Boss, real-time results loop-la error vandhathu.";

    await this.sendUpdate(`📂 *I found ${searchResults.length} potential leads/sources.* Starting data preparation...`);

    const fullContextList = [];
    
    // 2. STAGE 2: MULTI-ANGLE CRAWLING (ALL SOURCES)
    for (let i = 0; i < searchResults.length; i++) {
        const linkObj = searchResults[i];
        try {
          if (linkObj.link) {
            const domain = new URL(linkObj.link).hostname;
            await this.sendUpdate(`🧪 *Researching website ${i+1}/${searchResults.length}:* ${domain}...`);
            const content = await this.crawlUrl(linkObj.link);
            
            // Build a "Prep-Document" entry
            const entry = `[SOURCE: ${linkObj.title}]\nURL: ${linkObj.link}\nSNIPPET: ${linkObj.snippet}\nCONTENT: ${content || 'Crawl failed, using snippet'}`;
            fullContextList.push(entry);
          }
        } catch (err) {}
        
        if (i >= 11) break; // Maximum breadth vs performance
    }

    await this.sendUpdate(`📑 *Data Scouring Complete.* Preparing final CEO evaluation based on all evidence...`);

    const combinedData = fullContextList.join('\n\n====================\n\n');
    
    // 3. FINAL STAGE: CEO SYNTHESIS & FINALIZATION
    const synthesisPrompt = `Act as Jeenora's Executive CEO Strategist. 
    MISSION: Detailed research on: "${query}"
    
    PREPARED DATA FROM MULTIPLE SOURCES:
    ${combinedData}
    
    RESEARCH RULES:
    1. Do NOT give a generic answer. Use REAL data from the texts provided (numbers, names, presence).
    2. Analyze brand presence across all platforms mentioned in the data.
    3. Finalize a strategic "Boss Report" in TANGLISH. 
    4. If the data shows a presence (like social followers), acknowledge it as a key metric for 10L revenue.
    
    Structure: Analysis -> Competitive Reality -> Growth Opportunities -> CEO Action Plan.`;

    const report = await llm.deepThink(synthesisPrompt);
    
    // Cleanup temporary logs Boss
    await this.cleanupLogs();
    
    return `🏆 *FINAL STRATEGIC RESEARCH DOSSIER* \n\n${report}`;
  }

  /** Compatible findLeads */
  async findLeads(location, category) {
    const res = await this.searchNative(`${category} in ${location}`);
    return res.map(r => ({ title: r.title, website: r.link, snippet: r.snippet, phone: 'N/A' }));
  }
}

export const search = new AdvancedSearchService();
