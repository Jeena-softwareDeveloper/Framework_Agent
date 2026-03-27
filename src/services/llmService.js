import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from 'mongoose';
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { Task } from "../models/core/tasks.js";

class LLMService {
  constructor() {
    this.genAI = null;
    this.tools = [
      {
        functionDeclarations: [
          {
            name: "webSearch",
            description: "Deep research a query using multi-angle web scouring and synthesize a strategic dossier.",
            parameters: {
              type: "OBJECT",
              properties: { query: { type: "STRING" } },
              required: ["query"]
            }
          },
          {
            name: "queryDatabase",
            description: "Search internal Jeenora database for farmers, leads, or business records.",
            parameters: {
              type: "OBJECT",
              properties: { 
                collection: { type: "STRING", enum: ["leads", "farmers", "tasks", "Vault"], description: "Collection to search" },
                search: { type: "STRING", description: "Search term" }
              },
              required: ["collection", "search"]
            }
          },
          {
            name: "addTask",
            description: "Add a strategic mission to the autonomous task stack.",
            parameters: {
              type: "OBJECT",
              properties: { 
                title: { type: "STRING" }, 
                description: { type: "STRING" },
                priority: { type: "STRING", enum: ["High", "Medium", "Low"] }
              },
              required: ["title", "priority"]
            }
          },
          {
            name: "removeTask",
            description: "Remove a task from the stack by title.",
            parameters: {
              type: "OBJECT",
              properties: { search: { type: "STRING" } },
              required: ["search"]
            }
          },
          {
            name: "listTasks",
            description: "View current strategic mission stack.",
            parameters: { type: "OBJECT", properties: {} }
          },
          {
            name: "navigatorVisit",
            description: "Open a specific URL in the browser.",
            parameters: {
              type: "OBJECT",
              properties: { url: { type: "STRING" } },
              required: ["url"]
            }
          },
          {
            name: "navigatorObserve",
            description: "See what is currently on the screen (buttons, text, inputs, images).",
            parameters: { type: "OBJECT", properties: {} }
          },
          {
            name: "navigatorWait",
            description: "Pause the logic for a set time (ms) to allow page loading.",
            parameters: {
              type: "OBJECT",
              properties: { ms: { type: "NUMBER", description: "Milliseconds to wait" } },
              required: ["ms"]
            }
          },
          {
            name: "navigatorScroll",
            description: "Scroll the page up or down to load more content.",
            parameters: {
              type: "OBJECT",
              properties: {
                direction: { type: "STRING", enum: ["up", "down"] },
                distance: { type: "NUMBER", description: "Pixels to scroll (default 500)" }
              },
              required: ["direction"]
            }
          },
          {
            name: "navigatorAction",
            description: "Perform an action (click or type) on a page element.",
            parameters: {
              type: "OBJECT",
              properties: { 
                action: { type: "STRING", enum: ["click", "type"] },
                selector: { type: "STRING" },
                text: { type: "STRING", description: "Required only for type action" }
              },
              required: ["action", "selector"]
            }
          },
          {
            name: "executeGitMission",
            description: "Assign a Git/Code mission to Developer Ravi (Push code, Build check).",
            parameters: {
              type: "OBJECT",
              properties: {
                command: { type: "STRING", enum: ["push"], description: "The Git action to perform." },
                repoUrl: { type: "STRING", description: "The GitHub Repository URL." }
              },
              required: ["command", "repoUrl"]
            }
          },
          {
            name: "developerRaviAction",
            description: "Developer Ravi edits or reads the Agent-Framework's own code files.",
            parameters: {
              type: "OBJECT",
              properties: {
                action: { type: "STRING", enum: ["read", "edit"], description: "The action to perform." },
                path: { type: "STRING", description: "The file path relative to root." },
                content: { type: "STRING", description: "The new content if editing." }
              },
              required: ["action", "path"]
            }
          },
          {
            name: "manageCredentials",
            description: "Securely save or retrieve login credentials from the Vault.",
            parameters: {
              type: "OBJECT",
              properties: { 
                action: { type: "STRING", enum: ["save", "get"] },
                service: { type: "STRING", description: "e.g., instagram, facebook, twitter" },
                username: { type: "STRING" },
                password: { type: "STRING" }
              },
              required: ["action", "service"]
            }
          }
        ]
      }
    ];

    if (ENV.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
      logger.info('🧠 Gemini AI Service Initialized!');
    }
  }

  async deepThink(prompt, maxDepth = 12, chatId = "default_user") {
    if (!this.genAI) {
      return "❌ Gemini API key not found. Please check your .env file.";
    }

    const { search } = await import('./searchService.js');
    const { ChatLog } = await import('../models/core/chatLogs.js');

    // 🧠 LOAD, NORMALIZE & ALIGN CHAT HISTORY 
    const historyLogs = await ChatLog.find({ chatId }).sort({ timestamp: -1 }).limit(15);
    let rawHistory = historyLogs.reverse().map(log => {
      const cleanParts = log.parts.map(p => {
        const part = {};
        if (p.text) part.text = p.text;
        if (p.functionCall && log.role === 'model') part.functionCall = p.functionCall;
        if (p.functionResponse && log.role === 'user') part.functionResponse = p.functionResponse;
        return part;
      }).filter(p => Object.keys(p).length > 0);
      return { role: log.role, parts: cleanParts };
    }).filter(h => h.parts.length > 0);

    // 🛡️ CRITICAL FIX 1: History MUST start with role: 'user'
    const firstUserIndex = rawHistory.findIndex(h => h.role === 'user');
    let history = firstUserIndex !== -1 ? rawHistory.slice(firstUserIndex) : [];

    // 🛡️ CRITICAL FIX 2: History MUST alternate role: 'user', 'model', 'user'...
    const alternatingHistory = [];
    let lastRole = null;
    for (const h of history) {
      if (h.role !== lastRole) {
        alternatingHistory.push(h);
        lastRole = h.role;
      }
    }
    history = alternatingHistory;

    const sendThinkingUpdate = async (text) => {
       const safeText = text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '');
       await search.sendUpdate(`LOG: ${safeText}`);
    };

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        tools: this.tools,
        systemInstruction: `You are Jeenora's Executive CEO with 'ANTIGRAVITY' Deep-Thinking Logic.        LOGIC FRAMEWORK:
        1. CONTEXT: Remember history and Boss's goals.
        2. PARALLEL & CHAINED ACTIONS: You can call multiple tools in one turn. Use iterations to finish tasks.
        3. VERIFICATION: After every 'navigatorAction', you MUST perform 'navigatorObserve' at least once.
        4. PERSISTENCE: If you see a success, immediately scrape the notifications or feed data before returning. 
        5. MISSION: Get the data. Do not explain logic until the goal is achieved.
        6. LOADING & SCROLLING: If page looks empty, use navigatorWait for 5000ms AND navigatorScroll('down', 500). Then observe again to see feed items.
        
        REPORTING PROTOCOL (CEO DOSSIER):
        - Do not provide technical logs to the Boss.
        - NEVER use Markdown formatting (NO **, NO ###, NO *). Boss hates technical clutter.
        - Provide a 'CEO Dossier' in PLAIN TEXT with:
          1. Mission Status: (Brief summary).
          2. Highlights: (Top 3 findings using simple - bullets).
          3. Strategic Advice: (One clear next step).
        - Use professional, no-fluff Tanglish with clean spacing.

        TECHNICAL PROTOCOL (SAFE-PUSH):
        - You have a Developer teammate named Ravi.
        - Ravi has FULL AUTHORITY to read and EDIT THE CODE OF THIS FRAMEWORK ITSELF.
        - To improve YOUR OWN features or fix YOUR OWN bugs, Ravi must edit files first, then push.
        - DO NOT attempt to find or browse GitHub UI for code updates. Ravi handles the build check and token security via CLI.
        - DO NOT EVER use navigatorVisit('https://github.com/login') or similar manual actions.
        - If you do not know the repo URL, just tell Ravi to push to 'origin main'.
        - Zero downtime for the Jeenora website and bot is mandatory.

        PERSONALITY: Direct, Strategic, Result-Sniper (No-Fluff), Tanglish speaker.
        MISSION: 10 Lakhs/month revenue. Always address user as 'Boss'.`
      });

      // Start chat with context history!
      const chat = model.startChat({ history });
      const maxDepth = 25;
      let currentResponse = await chat.sendMessage(prompt);
      let iteration = 0;

      // RECURSIVE AUTONOMOUS THINKING LOOP
      while (iteration < maxDepth) {
        const functionCalls = currentResponse.response.functionCalls();
        if (!functionCalls || functionCalls.length === 0) break;

        await sendThinkingUpdate(`Step ${iteration + 1}/${maxDepth}: Strategic Reasoning...`);

        logger.info(`🧠 Deep Think Iteration ${iteration + 1}: Executing ${functionCalls.length} tools...`);
        const toolResults = [];

        for (const call of functionCalls) {
          const { name, args } = call;
          logger.info(`🤖 Autonomous Action: ${name}(${JSON.stringify(args)})`);
          
          if (name === "webSearch") {
            await sendThinkingUpdate(`Web Research query: "${args.query}"...`);
          } else if (name === "queryDatabase") {
            await sendThinkingUpdate(`DB query: "${args.search}"...`);
          }

          let data;
          try {
            if (name === "addTask") {
              const task = await new Task(args).save();
              data = { result: "Success", task_id: task._id };
            } else if (name === "removeTask") {
              const res = await Task.deleteOne({ title: new RegExp(args.search, 'i') });
              data = { result: res.deletedCount > 0 ? "Strategic task removed" : "Task not found" };
            } else if (name === "listTasks") {
              const list = await Task.find().limit(10);
              data = { current_task_list: list.map(t => ({ title: t.title, priority: t.priority })) };
            } else if (name === "queryDatabase") {
              const { collection, search: dbSearch } = args;
              const Model = mongoose.models[collection] || mongoose.model(collection);
              const query = { $or: [{ name: new RegExp(dbSearch, 'i') }, { district: new RegExp(dbSearch, 'i') }, { title: new RegExp(dbSearch, 'i') }]};
              const results = await Model.find(query).limit(5).catch(() => []);
              data = { results_count: results.length, data_sample: results.map(r => r.name || r.title || r._id) };
            } else if (name === "webSearch") {
              data = { search_analysis: await search.deepSearch(args.query) };
            } else if (name === "navigatorVisit") {
              const { browser } = await import('./browserService.js');
              const title = await browser.navigate(args.url);
              const summary = await browser.getContent();
              data = { title, content_preview: summary.substring(0, 800) };
              await sendThinkingUpdate(`Navegated to: ${title}. Continuing...`);
            } else if (name === "navigatorObserve") {
              const { browser } = await import('./browserService.js');
              const elements = await browser.getInteractables();
              const text = await browser.getContent();
              data = { 
                page_view: text.substring(0, 1500), 
                interactables: elements.map(e => `[${e.tag}] ${e.text} | SEL: ${e.selector}`) 
              };
              await sendThinkingUpdate(`Human-like viewport scan results obtained.`);
            } else if (name === "navigatorAction") {
              const { browser } = await import('./browserService.js');
              let actionResult;
              if (args.action === 'click') {
                  actionResult = await browser.click(args.selector);
              } else if (args.action === 'type') {
                  actionResult = await browser.type(args.selector, args.text);
              }
              data = { action: args.action, result: actionResult };
              await sendThinkingUpdate(`Action performed: ${args.action} on ${args.selector}`);
            } else if (name === "navigatorWait") {
              const { browser } = await import('./browserService.js');
              data = { result: await browser.wait(args.ms) };
              await sendThinkingUpdate(`Waiting for ${args.ms}ms for page content to settle...`);
            } else if (name === "navigatorScroll") {
              const { browser } = await import('./browserService.js');
              data = { result: await browser.scroll(args.direction, args.distance) };
              await sendThinkingUpdate(`Scrolling the viewport down like a human...`);
            } else if (name === "developerRaviAction") {
                const fs = (await import('fs')).promises;
                const pathJoin = (await import('path')).join;
                const fullPath = pathJoin(process.cwd(), args.path);
                
                if (args.action === 'read') {
                    data = { content: await fs.readFile(fullPath, 'utf8') };
                } else if (args.action === 'edit') {
                    await fs.writeFile(fullPath, args.content, 'utf8');
                    data = { result: `Project file ${args.path} updated by Developer Ravi.` };
                }
                await sendThinkingUpdate(`Developer Ravi is modifying the core framework code...`);
            } else if (name === "executeGitMission") {
              const { gitService } = await import('./gitService.js');
              data = { result: await gitService.executeMission(args.command, args.repoUrl) };
              await sendThinkingUpdate(`Developer Ravi is processing the code push...`);
            } else if (name === "manageCredentials") {
              const { Vault } = await import('./dbService.js');
              if (args.action === "save") {
                await Vault.findOneAndUpdate(
                  { service: args.service.toLowerCase() },
                  { username: args.username, password: args.password, updatedAt: new Date() },
                  { upsert: true }
                );
                data = { result: `Success: Saved ${args.service} to Vault.` };
                await sendThinkingUpdate(`Saved credentials for ${args.service}.`);
              } else if (args.action === "get") {
                const creds = await Vault.findOne({ service: args.service.toLowerCase() });
                
                // 🛡️ Boss, direct ENV fallback for GitHub Sniper Boss!
                let dataResult = creds ? { username: creds.username, password: creds.password } : null;
                
                if (!dataResult && args.service.toLowerCase() === 'github' && ENV.GITHUB_TOKEN) {
                    dataResult = { username: 'jeenoraofficial', password: ENV.GITHUB_TOKEN };
                    await sendThinkingUpdate(`Accessing GitHub Master Key directly from system environment Boss!`);
                }

                data = dataResult || { result: "Not found." };
                await sendThinkingUpdate(`Retrieved ${args.service} credentials.`);
              }
            }
          } catch (err) {
            data = { error: `Failed: ${err.message}` };
          }

          toolResults.push({ functionResponse: { name, response: data } });
        }

        // Send back to Gemini to see if it wants MORE deep-thinking
        await sendThinkingUpdate(`Analyzing results and deciding next move...`);
        currentResponse = await chat.sendMessage(toolResults);
        iteration++;
      }

      const finalReport = currentResponse.response.text();

      // 💾 SAVE CONVERSATION
      const { ChatLog } = await import('../models/core/chatLogs.js');
      await new ChatLog({ chatId, role: 'user', parts: [{ text: prompt }] }).save();
      await new ChatLog({ chatId, role: 'model', parts: [{ text: finalReport }] }).save();

      // Cleanup
      await search.cleanupLogs();
      const { browser } = await import('./browserService.js');
      await browser.close();
      
      return finalReport;
    } catch (e) {
      logger.error(`❌ Antigravity Error: ${e.message}`);
      await search.cleanupLogs();
      const { browser } = await import('./browserService.js');
      await browser.close();
      return "❌ Error in Deep Thinking logic cycle.";
    }
  }
}

export const llm = new LLMService();
