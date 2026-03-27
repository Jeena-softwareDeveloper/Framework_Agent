// src/services/telegramService.js
import TelegramBot from 'node-telegram-bot-api';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

class TelegramService {
  constructor() {
    if (!ENV.TELEGRAM_BOT_TOKEN) {
      logger.warn('Telegram token not set – skipping integration.');
      this.bot = null;
      return;
    }
    // Set polling: true to listen for incoming messages
    this.bot = new TelegramBot(ENV.TELEGRAM_BOT_TOKEN, { polling: true });
    logger.info('Telegram Bot Listener Active 🤖');
  }

  /**
   * Escapes special characters for Telegram Markdown Boss!
   */
  escapeMarkdown(text) {
    if (!text) return "";
    return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
  }

  /**
   * Sends long messages by splitting them into chunks of 4000 characters.
   */
  async sendLongMessage(chatId, text, options = {}) {
    if (!text) return;
    const CHUNK_SIZE = 4000;
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      let chunk = text.slice(i, i + CHUNK_SIZE);
      
      try {
        // Force Plain Text to prevent Markdown parsing crashes
        await this.bot.sendMessage(chatId, chunk);
      } catch (e) {
        logger.error(`Telegram Chunk Error: ${e.message}`);
      }
    }
  }

  /**
   * Listen for messages and handle them.
   */
  initListener(handler) {
    if (!this.bot) return;

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (chatId.toString() !== ENV.TELEGRAM_CHAT_ID.toString()) {
        logger.warn(`Unauthorized access attempt from Chat ID: ${chatId}`);
        return;
      }

      logger.info(`Telegram Recv: ${text}`);

      let typingInterval;
      try {
        // Show 'typing...' status every 4 seconds to keep it active
        await this.bot.sendChatAction(chatId, 'typing');
        typingInterval = setInterval(() => {
          this.bot.sendChatAction(chatId, 'typing').catch(() => {});
        }, 4000);

        const respond = async (res) => {
          await this.sendLongMessage(chatId, res);
        };

        const result = await handler(text, respond, chatId);
        if (result) {
          await this.sendLongMessage(chatId, result, { parse_mode: 'Markdown' });
        }
      } catch (e) {
        logger.error(`Error handling Telegram message: ${e.message}`);
        await this.bot.sendMessage(chatId, '⚠️ Boss, error aachchu analysis pannum pothu. Snag reported.');
      } finally {
        if (typingInterval) clearInterval(typingInterval);
      }
    });
  }

  /**
   * Send a general notification message to the user. Returns the sent message(s).
   */
  async sendMessage(text) {
    const chatId = ENV.TELEGRAM_CHAT_ID;
    if (!chatId || !this.bot) {
      logger.warn('Telegram chat ID not set or bot not initialized.');
      return null;
    }

    try {
      // Return the message object/array for tracking
      const CHUNK_SIZE = 4000;
      let lastMsg = null;
      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        const chunk = text.slice(i, i + CHUNK_SIZE);
        lastMsg = await this.bot.sendMessage(chatId, chunk);
      }
      return lastMsg;
    } catch (e) {
      logger.error(`Telegram message failed: ${e.message}`);
      return null;
    }
  }

  /**
   * Delete a specific message from chat.
   */
  async deleteMessage(messageId) {
    if (!this.bot || !messageId) return;
    try {
      await this.bot.deleteMessage(ENV.TELEGRAM_CHAT_ID, messageId);
    } catch (e) {
      // Fail silently if message is already gone
    }
  }
}

export const telegram = new TelegramService();

