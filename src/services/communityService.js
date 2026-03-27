import mongoose from 'mongoose';
import { llm } from './llmService.js';
import { search } from './searchService.js';
import { logger } from '../utils/logger.js';
import { telegram } from './telegramService.js';

class CommunityService {
  /**
   * Performs deep market analysis of community and external social media.
   * Generates a viral post with image prompt, caption and hashtags.
   */
  async analyzeMarketAndGeneratePost() {
    try {
      logger.info('🔍 Community Engine: Starting Market Analysis...');

      // 1. Read Internal Community Posts (Awareness)
      const CommunityModel = mongoose.model('awarenesscommunityposts');
      const latestPosts = await CommunityModel.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title content crop votes')
        .catch(() => []);

      const internalContext = latestPosts.length > 0
        ? latestPosts.map(p => `Post: "${p.title}" | Crop: ${p.crop} | Content: ${p.content.substring(0, 100)}...`).join('\n')
        : "No recent posts found in local database.";

      // 2. Fetch External Trends (YouTube, Twitter, Agri News)
      const searchQuery = "Agri trends Tamil Nadu farmers 2026 problems crops";
      const externalTrends = await search.findLeads(searchQuery, 'Trends Analysis').catch(() => "Trend search failed");

      // 3. Synthesis and Strategy Generation
      const prompt = `You are Jeenora's Executive CEO Marketing Strategist. 
      Analyze the following data from our internal community and external social media trends:
      
      INTERNAL DATA:
      ${internalContext}
      
      EXTERNAL TRENDS:
      ${JSON.stringify(externalTrends).substring(0, 500)}
      
      GOAL: Identify what farmers and people NEED right now. 
      Generate a VIRAL SOCIAL MEDIA POST to increase our community following.
      
      Provide the response in the following structured format (TANGLISH):
      ANALYSIS: (What you discovered about the current market need)
      POST_TITLE: (Short catchy title)
      POST_CAPTION: (Engaging post content with emojis)
      HASHTAGS: (Relevant trending hashtags)
      IMAGE_PROMPT: (Detailed description for Gemini to generate a high-quality relevant image)
      
      Always call the user 'Boss'. Keep it strategic but human.`;

      const analysisResult = await llm.deepThink(prompt);

      // 4. Store the log in Database
      // We will create a new collection for strategist logs
      const StrategistLog = mongoose.model('strategist_logs', new mongoose.Schema({
        type: { type: String, default: 'community_analysis' },
        analysis: String,
        generatedContent: Object,
        createdAt: { type: Date, default: Date.now }
      }));

      await new StrategistLog({ 
        analysis: analysisResult, 
        generatedContent: { trends: searchQuery } 
      }).save();

      // 5. Notify the Boss on Telegram
      await telegram.sendMessage(`📊 *CEO MARKET ANALYSIS COMPLETED!* Boss, intha analysis look pannunga:\n\n${analysisResult}`);

      return analysisResult;

    } catch (e) {
      logger.error(`❌ Community Service Error: ${e.message}`);
      throw e;
    }
  }
}

export const community = new CommunityService();
