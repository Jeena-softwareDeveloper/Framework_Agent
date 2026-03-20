// src/services/marketingService.js
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import { telegram } from './telegramService.js';
import { ENV } from '../config/env.js';

class MarketingService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: parseInt(ENV.SMTP_PORT) || 465,
      secure: (ENV.SMTP_PORT == 465), 
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(to, message) {
    logger.info(`📧 CEO Marketing: Sending Real Email to ${to}...`);
    try {
      const info = await this.transporter.sendMail({
        from: `"Jeenora Executive CEO" <${ENV.EMAIL_USER}>`,
        to: to,
        subject: "Strategic Partnership Opportunity from Jeenora",
        text: message
      });
      return true;
    } catch (e) {
      logger.error(`❌ Email failed: ${e.message}`);
      return false;
    }
  }

  async sendWhatsApp(phone, message) {
    logger.info(`💬 CEO Marketing (Simulated): Sending WhatsApp to ${phone}...`);
    if (telegram) await telegram.sendMessage(`📡 *LIVE MARKETING (Simulation):* WhatsApp pitch sent to ${phone} Boss! `).catch(() => {});
    return true;
  }
}

export const marketing = new MarketingService();
