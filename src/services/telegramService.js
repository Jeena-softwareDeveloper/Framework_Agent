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
    // Telegram max is 4096 chars — use full limit, no artificial cuts Boss!
    const CHUNK_SIZE = 4096;
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      const chunk = text.slice(i, i + CHUNK_SIZE);
      try {
        await this.bot.sendMessage(chatId, chunk);
        // Small delay between chunks to avoid rate limiting
        if (i + CHUNK_SIZE < text.length) await new Promise(r => setTimeout(r, 300));
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

      // 🛡️ INSTANT CEO STATUS - Send immediately before processing Boss!
      const thinkingMsg = await this.bot.sendMessage(chatId, '🧠 CEO analyzing... ⏳').catch(() => null);

      // Keep typing indicator alive
      const typingInterval = setInterval(() => {
        this.bot.sendChatAction(chatId, 'typing').catch(() => {});
      }, 4000);

      try {
        const respond = async (res) => {
          await this.sendLongMessage(chatId, res);
        };

        let lastStreamText = '';
        const onStream = async (textChunk) => {
          if (!textChunk || textChunk === lastStreamText) return;
          lastStreamText = textChunk;
          
          if (textChunk.length <= 4000 && thinkingMsg) {
            try {
              await this.bot.editMessageText(textChunk, {
                chat_id: chatId,
                message_id: thinkingMsg.message_id
              });
            } catch(e) {} // Ignore rate limits during stream!
          }
        };

        const result = await handler(text, respond, chatId, onStream);

        // 🛡️ Final Bulletproof Sync for Telegram Boss!
        // We wait 1 second to bypass any previous rate limits from the live stream
        await new Promise(r => setTimeout(r, 1000));

        if (result) {
          // If message is short enough, update the thinking message ONE LAST time with 100% guaranteed text
          if (result.length <= 4000 && thinkingMsg) {
             await this.bot.editMessageText(result, {
                chat_id: chatId,
                message_id: thinkingMsg.message_id
             }).catch(async () => {
                // If it still fails, just delete and resend!
                await this.bot.deleteMessage(chatId, thinkingMsg.message_id).catch(() => {});
                await this.bot.sendMessage(chatId, result);
             });
          } else {
             // If too long, delete the stream message and send as safe chunks!
             if (thinkingMsg) await this.bot.deleteMessage(chatId, thinkingMsg.message_id).catch(() => {});
             await this.sendLongMessage(chatId, result);
          }
        } else if (thinkingMsg) {
          await this.bot.deleteMessage(chatId, thinkingMsg.message_id).catch(() => {});
        }
      } catch (e) {
        logger.error(`Error handling Telegram message: ${e.message}`);
        if (thinkingMsg) {
          await this.bot.deleteMessage(chatId, thinkingMsg.message_id).catch(() => {});
        }
        await this.bot.sendMessage(chatId, '⚠️ Boss, error aachchu. Try again!');
      } finally {
        clearInterval(typingInterval);
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

