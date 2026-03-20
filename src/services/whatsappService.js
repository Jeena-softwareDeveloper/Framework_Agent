// src/services/whatsappService.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import QRCodeLib from 'qrcode'; // Real image generator
import { logger } from '../utils/logger.js';
import { telegram } from './telegramService.js';
import fs from 'fs';
import path from 'path';

class WhatsappService {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      }
    });

    this.client.on('qr', async (qr) => {
      logger.info('📱 WhatsApp QR Received! Scan in terminal or via Link Boss:');
      qrcode.generate(qr, { small: true });
      
      try {
        // Save as image for easy link access
        const qrPath = path.join(process.cwd(), 'public', 'qr.png');
        await QRCodeLib.toFile(qrPath, qr);
        logger.info(`🌐 QR Image saved to ${qrPath}`);
        
        // Notify Telegram with the Link
        await telegram.sendMessage(`📱 *WhatsApp CEO Alert:* Scan code ready Boss!\n\n🔗 **Open this link to scan:**\nhttp://localhost:3000/qr.png`);
      } catch (e) {
        logger.error(`❌ QR Image fail: ${e.message}`);
      }
    });

    this.client.on('ready', () => {
      logger.success('✅ WhatsApp Executive Client is READY Boss! 🚀');
      telegram.sendMessage('✅ *WhatsApp Status:* Your phone is now Linked and Active Boss! 🚀').catch(() => {});
      
      // Remove QR image after success
      const qrPath = path.join(process.cwd(), 'public', 'qr.png');
      if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);
    });
  }

  async init() {
    logger.info('🛡️ Initializing WhatsApp Web Engine...');
    this.client.initialize();
  }

  async sendMessage(phone, text) {
      try {
        let cleanPhone = phone.replace(/\D/g, '');
        if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
        const chatId = `${cleanPhone}@c.us`;
        await this.client.sendMessage(chatId, text);
        logger.success(`🚀 WhatsApp message sent to ${phone} Boss!`);
        return true;
      } catch (e) {
        return false;
      }
  }
}

export const whatsapp = new WhatsappService();
