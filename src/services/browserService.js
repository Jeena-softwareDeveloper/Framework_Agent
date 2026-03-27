import puppeteer from 'puppeteer';
import { logger } from '../utils/logger.js';

class BrowserService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: "new", 
        userDataDir: 'd:/access/Agent-Framework/.puppeteer-data', // Bot's brain memory for sessions!
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=IsolateOrigins,site-per-process'] 
      });
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1280, height: 800 });
      logger.info('🚀 Puppeteer Browser Engine Injected!');
    }
    return this.page;
  }

  async navigate(url) {
    if (!this.page) await this.init();
    logger.info(`🌐 Browser Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    return this.page.title();
  }

  async click(selector) {
    if (!this.page) return "Error: Browser not initialized";
    logger.info(`🖱️ Browser Clicking: ${selector}`);
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.click(selector);
    return `Success: Clicked ${selector}`;
  }

  async type(selector, text) {
    if (!this.page) return "Error: Browser not initialized";
    logger.info(`⌨️ Browser Typing into ${selector}: ${text}`);
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.type(selector, text, { delay: 100 });
    return `Success: Typed into ${selector}`;
  }

  /**
   * Returns Interactive and Content elements for the AI to 'SEE' the page structure Boss!
   */
  async getInteractables() {
    if (!this.page) return [];
    return await this.page.evaluate(() => {
      const selectors = 'button, a, input, [role="button"], p, span, h1, h2, h3, article';
      const elements = Array.from(document.querySelectorAll(selectors));
      
      return elements
        .map(el => ({
          tag: el.tagName,
          text: (el.innerText || el.placeholder || el.value || el.ariaLabel || '').trim().slice(0, 100),
          id: el.id,
          class: el.className,
          type: el.type,
          selector: el.id ? `#${el.id}` : (el.tagName.toLowerCase() + (el.className ? `.${Array.from(el.classList).join('.')}` : ''))
        }))
        .filter(e => e.text.length > 2) // Filter noise but keep content
        .slice(0, 50);
    });
  }

  async getContent() {
    if (!this.page) return "";
    return await this.page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 5000));
  }

  async scroll(direction = 'down', distance = 500) {
    if (!this.page) return "Error: Browser not initialized";
    logger.info(`📜 Browser Scrolling: ${direction} by ${distance}px`);
    await this.page.evaluate((d, dist) => {
      window.scrollBy(0, d === 'down' ? dist : -dist);
    }, direction, distance);
    return `Success: Scrolled ${direction} ${distance}px`;
  }

  async wait(ms) {
    logger.info(`⏳ Browser Waiting for ${ms}ms...`);
    await new Promise(resolve => setTimeout(resolve, ms));
    return `Success: Waited ${ms}ms`;
  }

  async takeScreenshot() {
    if (!this.page) return null;
    const buffer = await this.page.screenshot({ fullPage: false, encoding: 'base64' });
    return buffer;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      logger.info('🛑 Browser Engine Stopped.');
    }
  }
}

export const browser = new BrowserService();
