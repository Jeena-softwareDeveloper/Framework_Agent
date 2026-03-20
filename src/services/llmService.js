// src/services/llmService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

class LLMService {
  constructor() {
    this.genAI = null;
    this.groq = null;

    if (ENV.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
      logger.info('🧠 Gemini AI Service Initialized!');
    }

    if (ENV.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
      logger.info('⚡ Groq Service Initialized (as Fallback).');
    }
  }

  async deepThink(prompt) {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (e) {
        logger.error(`❌ Gemini 3.1 Error: ${e.message} (Full Stack: ${e.stack})`);
        logger.error(`Falling back to Groq...`);
      }
    }

    if (this.groq) {
      try {
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
        });
        return chatCompletion.choices[0]?.message?.content || "No content from Groq.";
      } catch (e) {
        logger.error(`❌ Groq Fallback Error: ${e.message}`);
      }
    }

    return "❌ No LLM service available. Please check your API keys.";
  }
}

export const llm = new LLMService();
