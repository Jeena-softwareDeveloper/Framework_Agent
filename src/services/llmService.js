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

    logger.info('🧠 Jeenora AGENT-FRAMEWORK Brain Initialized Boss! 🛡️⚡🚀');
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
      logger.info(`🧠 LLM Brain Call: "${prompt.slice(0, 40)}"`);

      // 🚀 HYBRID DIRECT CALL — Fast text, but supports [AGENT_SEARCH] Tool! 🛡️⚡
      const { telegram } = await import('./telegramService.js');
      
      let engine;
      if (ENV.OPENROUTER_API_KEY) {
          const { openRouter } = await import('./openRouterService.js');
          engine = openRouter;
          logger.info(`🚀 Using OpenRouter Brain (${ENV.OPENROUTER_MODEL}) Boss!`);
      } else {
          const { deepSeek } = await import('./deepSeekService.js');
          engine = deepSeek;
          logger.info(`🚀 Using DeepSeek Cloud Scraper Boss!`);
      }
      
      let iteration = 0;
      let currentPrompt = prompt;
      let finalResponse = "";

      // 🛡️ BATTLE TEST: Persistent loop for autonomous navigation Boss! 🛡️⚡🚀
      while (iteration < 10) {
        let responseText = await engine.think(currentPrompt, history, onStream);
        
        // 🛡️ GENERIC AUTONOMOUS NAVIGATOR TOOLS Boss! 👤⚡🚀🧿🧬
        const navMatch = responseText.match(/\[NAVIGATE\]\s*([^ \n\r\t]+)/i);
        const clickMatch = responseText.match(/\[CLICK\]\s*([^ \n\r\t]+)/i);
        const typeMatch = responseText.match(/\[TYPE\]\s*([^ \n\r\t]+)\s+(.+)/i);
        const readMatch = responseText.match(/\[READ\]/i);
        const scrollMatch = responseText.match(/\[SCROLL\]\s*(\S+)/i);
        const askMatch = responseText.match(/\[ASK_USER\]\s*(.+)/i);
        const searchMatch = responseText.match(/\[AGENT_SEARCH\]([^\[\]\n]+)/i);

        // 🛡️ PRIORITY: TOOL EXECUTION Boss! 🛠️🎯
        try {
            if (navMatch) {
                const url = navMatch[1].trim();
                logger.info(`🤖 Navigator: Moving to ${url}`);
                await telegram.sendMessage(chatId, `🌐 *Navigator:* Moving to **${url}** Boss...`);
                const title = await (await import('./browserService.js')).browser.navigate(url);
                currentPrompt = `[SYSTEM NAVIGATOR RESULT]: Arrived at "${title}". Page Loaded. Now [READ] to see what's on screen and find the inputs/buttons Boss!`;
                iteration++;
                continue;
            }

            if (readMatch) {
                logger.info('🤖 Navigator: Reading page structure');
                const { browser } = await import('./browserService.js');
                const elements = await browser.getInteractables();
                const textContent = await browser.getContent();
                currentPrompt = `[SYSTEM READ RESULT]: \nVisible elements: ${JSON.stringify(elements)}\n\nText Summary: ${textContent.slice(0, 1000)}\n\nNow decide which [CLICK] or [TYPE] to perform next to log in or achieve the goal Boss!`;
                iteration++;
                continue;
            }

            if (typeMatch) {
                const selector = typeMatch[1].trim();
                const text = typeMatch[2].trim();
                logger.info(`🤖 Navigator: Typing into ${selector}`);
                const result = await (await import('./browserService.js')).browser.type(selector, text);
                currentPrompt = `[SYSTEM TYPE RESULT]: ${result}. Now [READ] to verify it's typed and find the Submit button Boss!`;
                iteration++;
                continue;
            }

            if (clickMatch) {
                const selector = clickMatch[1].trim();
                logger.info(`🤖 Navigator: Clicking ${selector}`);
                const result = await (await import('./browserService.js')).browser.click(selector);
                currentPrompt = `[SYSTEM CLICK RESULT]: ${result}. Now [READ] to see its effect Boss!`;
                iteration++;
                continue;
            }

            if (scrollMatch) {
                const dir = scrollMatch[1].trim();
                logger.info(`🤖 Navigator: Scrolling ${dir}`);
                await (await import('./browserService.js')).browser.scroll(dir);
                currentPrompt = `[SYSTEM SCROLL RESULT]: Scrolled ${dir}. Now [READ] again Boss!`;
                iteration++;
                continue;
            }

            if (searchMatch) {
                const query = searchMatch[1].trim();
                logger.info(`🤖 Agent Tool Triggered by CEO: WebSearch -> ${query}`);
                await telegram.sendMessage(chatId, `🔍 *CEO Requesting Agent:* Searching Google for "${query}" Boss...`);
                
                const { search } = await import('./searchService.js');
                const searchResults = await search.deepSearch(query);
                currentPrompt = `[SYSTEM TOOL RESULT for live internet search "${query}"]: \n${JSON.stringify(searchResults).slice(0, 2500)}\n\nNow continue your mission based on this data Boss!`;
                iteration++;
                continue;
            }

            if (askMatch) {
                const question = askMatch[1].trim();
                logger.info(`🤖 Navigator: Asking Boss -> ${question}`);
                await telegram.sendMessage(chatId, `👤 *CEO Request:* ${question}`);
                return `Boss, I've sent the request to you: "${question}". Waiting for your reply!`;
            }
        } catch (toolError) {
            logger.warn(`🤖 Tool Error Encountered: ${toolError.message}`);
            currentPrompt = `[SYSTEM TOOL ERROR]: "${toolError.message}". This selector or action failed. Please [READ] the page again to find a better selector or try a different approach Boss!`;
            iteration++;
            continue;
        }


        finalResponse = responseText || "Boss, LLM-lendhu response varalai. Try again!";
        break; // Normal conversation reached!
      }

      // Save conversation history
      await new ChatLog({ chatId, role: 'user', parts: [{ text: prompt }] }).save();
      await new ChatLog({ chatId, role: 'model', parts: [{ text: finalResponse }] }).save();

      return finalResponse;
    } catch (e) {
      logger.error(`❌ LLM Brain Error: ${e.message}`);
      return `Boss, LLM Brain-lendhu result edukka prechana aachchu: ${e.message}`;
    }
  }
}

export const llm = new LLMService();
