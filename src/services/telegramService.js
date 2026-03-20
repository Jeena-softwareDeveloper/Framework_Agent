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
   * Sends long messages by splitting them into chunks of 4000 characters.
   */
  async sendLongMessage(chatId, text, options = {}) {
    if (!text) return;
    const CHUNK_SIZE = 4000;
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      const chunk = text.slice(i, i + CHUNK_SIZE);
      try {
        await this.bot.sendMessage(chatId, chunk, options);
      } catch (e) {
        // Fallback to plain if Markdown fails on a chunk
        await this.bot.sendMessage(chatId, chunk);
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

      try {
        const respond = async (res) => {
          await this.sendLongMessage(chatId, res, { parse_mode: 'Markdown' });
        };

        const result = await handler(text, respond);
        if (result) {
          await this.sendLongMessage(chatId, result, { parse_mode: 'Markdown' });
        }
      } catch (e) {
        logger.error(`Error handling Telegram message: ${e.message}`);
        await this.bot.sendMessage(chatId, '⚠️ Boss, error aachchu analysis pannum pothu. Snag reported.');
      }
    });
  }

  /**
   * Send a general notification message to the user.
   */
  async sendMessage(text) {
    const chatId = ENV.TELEGRAM_CHAT_ID;
    if (!chatId || !this.bot) {
      logger.warn('Telegram chat ID not set or bot not initialized.');
      return;
    }

    try {
      await this.sendLongMessage(chatId, text, { parse_mode: 'Markdown' });
      logger.success('Notification chunks sent via Telegram.');
    } catch (e) {
      logger.error(`Telegram message failed: ${e.message}`);
    }
  }
}

export const telegram = new TelegramService();

