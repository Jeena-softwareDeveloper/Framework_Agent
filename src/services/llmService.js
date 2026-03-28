import axios from 'axios';
import mongoose from 'mongoose';
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { Task } from "../models/core/tasks.js";

class LLMService {
  constructor() {
    this.tools = [
      {
        type: 'function',
        function: {
          name: "webSearch",
          description: "Deep research a query using multi-angle web scouring and synthesize a strategic dossier.",
          parameters: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"]
          }
        }
      },
      {
        type: 'function',
        function: {
          name: "queryDatabase",
          description: "Search internal Jeenora database for farmers, leads, or business records.",
          parameters: {
            type: "object",
            properties: {
              collection: { type: "string", enum: ["leads", "farmers", "tasks", "Vault"], description: "Collection to search" },
              search: { type: "string", description: "Search term" }
            },
            required: ["collection", "search"]
          }
        }
      },
      {
        type: 'function',
        function: {
          name: "addTask",
          description: "Add a strategic mission to the autonomous task stack.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              priority: { type: "string", enum: ["High", "Medium", "Low"] }
            },
            required: ["title", "priority"]
          }
        }
      },
      {
        type: 'function',
        function: {
          name: "navigatorVisit",
          description: "Open a specific URL in the browser.",
          parameters: {
            type: "object",
            properties: { url: { type: "string" } },
            required: ["url"]
          }
        }
      },
      {
        type: 'function',
        function: {
          name: "navigatorObserve",
          description: "See what is currently on the screen (buttons, text, inputs, images).",
          parameters: { type: "object", properties: {} }
        }
      },
      {
        type: 'function',
        function: {
          name: "navigatorAction",
          description: "Perform an action (click or type) on a page element.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["click", "type"] },
              selector: { type: "string" },
              text: { type: "string", description: "Required only for type action" }
            },
            required: ["action", "selector"]
          }
        }
      },
      {
        type: 'function',
        function: {
          name: "developerRaviAction",
          description: "Developer Ravi edits or reads the Agent-Framework's own code files.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["read", "edit"], description: "The action to perform." },
              path: { type: "string", description: "The file path relative to root." },
              content: { type: "string", description: "The new content if editing." }
            },
            required: ["action", "path"]
          }
        }
      },
      {
        type: 'function',
        function: {
          name: "manageCredentials",
          description: "Securely save or retrieve login credentials from the Vault.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["save", "get"] },
              service: { type: "string", description: "e.g., instagram, facebook, twitter" },
              username: { type: "string" },
              password: { type: "string" }
            },
            required: ["action", "service"]
          }
        }
      }
    ];

    logger.info('🧠 Ollama Local CEO Brain (Llama 3.2 3B) Initialized Boss! 🛡️⚡🚀');
  }

  async deepThink(prompt, maxDepth = 1, chatId = "default_user", onStream = null) {
    const { ChatLog } = await import('../models/core/chatLogs.js');

    // Load last 5 messages for context Boss!
    const historyLogs = await ChatLog.find({ chatId }).sort({ timestamp: -1 }).limit(5);
    const history = historyLogs.reverse().map(log => ({
      role: log.role === 'model' ? 'assistant' : 'user',
      content: log.parts[0]?.text || ''
    }));

    try {
      logger.info(`🧠 DeepSeek Direct Call: "${prompt.slice(0, 40)}"`);

      // 🚀 HYBRID DIRECT CALL — Fast text, but supports [AGENT_SEARCH] Tool! 🛡️⚡
      const { deepSeek } = await import('./deepSeekService.js');
      const { telegram } = await import('./telegramService.js');
      
      let iteration = 0;
      let currentPrompt = prompt;
      let finalResponse = "";

      while (iteration < 3) {
        let responseText = await deepSeek.think(currentPrompt, history, onStream);
        
        // 🛡️ BATTLE TEST: Did the CEO ask the Agent to search Google?
        const searchMatch = responseText.match(/\[AGENT_SEARCH\]([^\[\]\n]+)/i);
        
        if (searchMatch) {
            const query = searchMatch[1].trim();
            logger.info(`🤖 Agent Tool Triggered by CEO: WebSearch -> ${query}`);
            
            // Notify Boss 
            await telegram.sendMessage(chatId ? chatId : ENV.TELEGRAM_CHAT_ID, `🔍 *CEO Requesting Agent:* Searching Google for "${query}" Boss...`);
            
            try {
               const { search } = await import('./searchService.js');
               const searchResults = await search.deepSearch(query);
               currentPrompt = `[SYSTEM TOOL RESULT for live internet search "${query}"]: \n${JSON.stringify(searchResults).slice(0, 2500)}\n\nNow, give the final strategy/answer to the boss in Tanglish based on this data.`;
            } catch (e) {
               currentPrompt = `[SYSTEM TOOL FAIL]: Search failed with error ${e.message}. Tell the boss you couldn't search right now in Tanglish.`;
            }
            
            iteration++;
            continue; // Loop back and feed the results to DeepSeek!
        }

        finalResponse = responseText || "Boss, DeepSeek-lendhu response varalai. Try again!";
        break; // Normal Tanglish response reached! Finish!
      }

      // Save conversation history
      await new ChatLog({ chatId, role: 'user', parts: [{ text: prompt }] }).save();
      await new ChatLog({ chatId, role: 'model', parts: [{ text: finalResponse }] }).save();

      return finalResponse;
    } catch (e) {
      logger.error(`❌ DeepSeek Error: ${e.message}`);
      return `Boss, DeepSeek-lendhu result edukka prechana aachchu: ${e.message}`;
    }
  }
}

export const llm = new LLMService();
