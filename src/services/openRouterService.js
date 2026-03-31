import axios from 'axios';
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

class OpenRouterService {
    constructor() {
        this.apiKey = ENV.OPENROUTER_API_KEY;
        this.baseUrl = "https://openrouter.ai/api/v1";
        this.model = ENV.OPENROUTER_MODEL || "qwen/qwen3.6-plus-preview:free";
    }

    async think(prompt, history = [], onStream = null) {
        logger.info(`🧠 OpenRouter Cloud Brain (${this.model}): ${prompt.slice(0, 50)}...`);

        try {
            if (!this.apiKey) {
                throw new Error("OPENROUTER_API_KEY is missing in .env Boss!");
            }

            const messages = [
                {
                    role: "system",
                    content: `You are Jeenora's Executive CEO Agent.
LANGUAGE: Always respond in TANGLISH (Tamil + English mix). Example: "Boss, analysis panni paathom. Results romba nalla irukku!"
STYLE: Conversational, professional, like a smart business advisor.
ADDRESS the user as "Boss".

AUTONOMOUS NAVIGATION TOOLS (Self-Driving Browser):
1. [NAVIGATE] <url> - Go to any website.
2. [READ] - Get a list of buttons, inputs, and text on the current page. ALWAYS [READ] after navigating or clicking to see where you are.
3. [CLICK] <selector> - Click an element.
4. [TYPE] <selector> <text> - Type text into an input.
5. [SCROLL] <down/up> - Move the page.
6. [ASK_USER] <question> - If you need a password, OTP, or help, ask the Boss. The loop will pause and wait for their reply.

GENERIC AI TOOLS:
- [AGENT_SEARCH] <query> - Search Google for real-time data.

GOAL: 10 Lakhs/month revenue. Execute missions autonomously by browsing websites yourself. 

CRITICAL: If you need to use a tool (NAVIGATE, READ, CLICK, etc.), ONLY output the tool command(s). Do NOT add any preamble, conversational filler, or explanation. Output the tool and NOTHING ELSE. I will provide the result, and you can continue until the mission is finished.

FORMATTING: Bullet points for Telegram. No tables.`
                },
                ...history,
                { role: "user", content: prompt }
            ];

            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: messages,
                    stream: true
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.apiKey}`,
                        "HTTP-Referer": "https://jeenora.com",
                        "X-Title": "Jeenora AGENT-FRAMEWORK",
                        "Content-Type": "application/json"
                    },
                    responseType: 'stream'
                }
            );

            let fullContent = "";
            
            return new Promise((resolve, reject) => {
                response.data.on('data', async (chunk) => {
                    const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        const message = line.replace(/^data: /, '');
                        if (message === '[DONE]') {
                            resolve(fullContent);
                            return;
                        }
                        try {
                            const parsed = JSON.parse(message);
                            const content = parsed.choices[0]?.delta?.content || "";
                            if (content) {
                                fullContent += content;
                                if (onStream) onStream(fullContent);
                            }
                            // Capture usage data like reasoning tokens if available
                            if (parsed.usage && parsed.usage.reasoning_tokens) {
                                logger.info(`🛡️ Reasoning tokens used: ${parsed.usage.reasoning_tokens}`);
                            }
                        } catch (e) {
                            // Non-JSON lines or incomplete chunks Boss!
                        }
                    }
                });
                
                response.data.on('end', () => resolve(fullContent));
                response.data.on('error', (err) => reject(err));
            });
        } catch (e) {
            const errorMsg = e.response?.data?.error?.message || e.message;
            logger.error(`❌ OpenRouter Error: ${errorMsg}`);
            return `Boss, OpenRouter-lendhu result edukka prechana aachchu: ${errorMsg}`;
        }
    }
}

export const openRouter = new OpenRouterService();
