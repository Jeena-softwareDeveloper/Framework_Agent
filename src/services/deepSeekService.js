import { browser } from './browserService.js';
import { telegram } from './telegramService.js';
import { logger } from '../utils/logger.js';
import { Vault } from './dbService.js';
import fs from 'fs';

class DeepSeekService {
  constructor() {
    this.loginUrl = 'https://chat.deepseek.com/sign_in';
    this.chatUrl = 'https://chat.deepseek.com/';
    this.activeChatUrl = null; // 🔗 Locked chat session - same chat always!
    this.isReady = false;      // ✅ Tracks if browser is warmed up
    this.urlFilePath = 'd:/access/Agent-Framework/.puppeteer-data/active_chat.txt';
  }

  /**
   * 🛡️ THE STRATEGIC BRAIN ENGINE
   * This is our primary 'all-over' engine Boss! 🛡️⚡🚀💰🎯
   */
  async think(prompt, history = [], onStream = null) {
    logger.info(`🧠 DeepSeek Cloud Brain: ${prompt.slice(0, 50)}...`);
    
    try {
      // 💾 Load offline URL if missing Boss!
      if (!this.activeChatUrl && fs.existsSync(this.urlFilePath)) {
        this.activeChatUrl = fs.readFileSync(this.urlFilePath, 'utf8').trim();
        logger.info(`🔗 Loaded offline active chat URL: ${this.activeChatUrl}`);
      }

      if (!browser.page) await browser.init();
      const page = browser.page;
      const currentUrl = page.url();

      // 🔗 SAME CHAT SESSION — Lock to existing chat Boss!
      if (this.activeChatUrl && currentUrl !== this.activeChatUrl && this.activeChatUrl.includes('chat.deepseek.com/a/chat/s/')) {
        logger.info(`🔗 Returning to locked chat session...`);
        await page.goto(this.activeChatUrl, { waitUntil: 'load', timeout: 60000 });
        await browser.wait(3000); // Give it time to load history!
        
        // 🛡️ BATTLE TEST: Did the old chat actually load, or was it deleted?
        const hasHistory = await page.evaluate(() => document.querySelectorAll('.ds-markdown').length > 0).catch(() => false);
        if (!hasHistory) {
          logger.warn('⚠️ Locked chat is DEAD or empty! Resetting to NEW chat Boss! 🛡️⚡');
          this.activeChatUrl = null;
          await page.goto(this.chatUrl, { waitUntil: 'load', timeout: 60000 });
          await browser.wait(3000);
        }
      } else if (!this.activeChatUrl || !this.activeChatUrl.includes('chat.deepseek.com/a/chat/s/')) {
        // First time — go to main chat page
        if (!currentUrl.includes('chat.deepseek.com') || currentUrl.includes('sign_in')) {
          await page.goto(this.chatUrl, { waitUntil: 'load', timeout: 90000 });
          await browser.wait(5000); // First-time Cloudflare settle
        }
      }

      // 🔐 Handle Login if needed
      const isLoggedIn = await this.checkLogin(page);
      if (!isLoggedIn) {
        await this.handleLogin(page);
        
        if (this.activeChatUrl && this.activeChatUrl.includes('/a/chat/s/')) {
          await page.goto(this.activeChatUrl, { waitUntil: 'load', timeout: 90000 });
        } else {
          await page.goto(this.chatUrl, { waitUntil: 'load', timeout: 90000 });
        }
        await browser.wait(5000);
      }

      // ⌨️ Type and Submit — Just the user message, clean and fast!
      const inputSelector = 'textarea[placeholder="Message DeepSeek"]';
      logger.info('🔍 Searching for DeepSeek chat input...');
      
      await page.waitForSelector(inputSelector, { timeout: 45000 });
      const input = await page.$(inputSelector);
      
      // Clear and type Boss!
      await input.click();
      await browser.wait(200);
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      
      // 🛡️ Type ONLY the system instructions if it's a new conversation
      let textToType = prompt;
      
      const isNewChat = !this.activeChatUrl || !page.url().includes('/a/chat/s/');
      if (isNewChat) {
         textToType = `You are Jeenora's Executive CEO Agent.
LANGUAGE: Always respond in TANGLISH (Tamil + English mix). Example: "Boss, analysis panni paathom. Results romba nalla irukku!"
STYLE: Conversational, professional, like a smart business advisor texting on WhatsApp.
DO NOT use JSON format. Just reply naturally in Tanglish.
ADDRESS the user as "Boss".
MISSION: 10 Lakhs/month revenue strategy for Jeenora.

FORMATTING RULES FOR TELEGRAM:
1. NEVER use tables (|---|). They break in Telegram. Use simple bullet points instead.
2. DO NOT use citation numbers (like [1], [2]). Just write the text naturally.
3. Keep it clean and easy to read on mobile.

TOOLS: If you MUST search the live internet/Google, you can command the Agent by outputting EXACTLY: [AGENT_SEARCH] your search query
Do NOT use tools unless necessary. If you use the tool, I will reply with the results, and then you can answer the Boss.

USER ASKED: ${prompt}`;
         logger.info('🔰 Injecting System Identity for new chat session Boss!');
      }

      await input.type(textToType, { delay: 15 });
      await page.keyboard.press('Enter');

      // ⏳ Wait for response
      await browser.wait(1000); 
      let result = await this.scrapeResponse(page, onStream);

      // 🔗 Lock to this chat URL after first successful exchange
      if (!this.activeChatUrl || this.activeChatUrl !== page.url()) {
        const newUrl = page.url();
        if (newUrl.includes('/a/chat/s/')) {
          this.activeChatUrl = newUrl;
          fs.writeFileSync(this.urlFilePath, this.activeChatUrl);
          logger.info(`🔗 Chat session locked & saved offline: ${this.activeChatUrl}`);
        }
      }
      
      return result;
    } catch (e) {
      logger.error(`❌ DeepSeek Brain Error: ${e.message}`);
      
      // 🛡️ SNIPER DIAGNOSTICS: Screenshot the blocker! 🛡️📸
      try {
        if (browser.page) {
          const path = (await import('path')).join(process.cwd(), 'tmp', `brain_blockER_${Date.now()}.png`);
          await browser.page.screenshot({ path });
          logger.info(`📸 Sniper Screenshot saved for debug: ${path}`);
          await telegram.sendMessage(`🛡️ Boss, logic blocked! Check the debug screenshot in your tmp/ folder. Error: ${e.message}`);
        }
      } catch (err) {
        logger.error(`Failed to take debug screenshot: ${err.message}`);
      }

      return `{"error": "Boss, DeepSeek logic-la prechana: ${e.message}"}`;
    }
  }

  async checkLogin(page) {
    // Check if the input box exists Boss!
    const inputExists = await page.evaluate(() => !!document.querySelector('textarea'));
    const loginExists = await page.evaluate(() => !!document.querySelector('a[href="/login"]'));
    return inputExists && !loginExists;
  }

  async handleLogin(page) {
    logger.warn('🛡️ Login required for DeepSeek Cloud Brain Boss!');
    
    // Check Vault for credentials Boss! 🛡️🔐
    let creds = await Vault.findOne({ service: 'deepseek' });
    
    if (!creds || !creds.username || !creds.password) {
      await telegram.sendMessage("🛡️ Boss, DeepSeek login credentials venum! Please reply in this format: \n\n/login_ds <username> <password>");
      // We will wait for the user to provide them Boss.
      throw new Error("Credentials missing. Please login via Telegram first.");
    }

    // Attempt Login with CONFIRMED SELECTORS Boss! 🛡️🧿⚡
    await page.goto(this.loginUrl, { waitUntil: 'load', timeout: 90000 });
    await browser.wait(3000);

    // 🧿 CONFIRMED from live DOM inspection:
    // Email: input.ds-input__input (first input)
    // Password: input.ds-input__input[type="password"]
    // Button: button.ds-basic-button--primary

    await page.waitForSelector('.ds-input__input', { timeout: 30000 });

    // Type email/phone Boss!
    const inputs = await page.$$('.ds-input__input');
    await inputs[0].click({ clickCount: 3 });
    await inputs[0].type(creds.username, { delay: 100 });
    
    // Type password Boss!
    await inputs[1].click({ clickCount: 3 });
    await inputs[1].type(creds.password, { delay: 100 });
    
    // Click the confirmed login button Boss!
    await page.click('button.ds-basic-button--primary');
    
    // Wait for SPA to settle Boss!
    await page.waitForNavigation({ waitUntil: 'load', timeout: 90000 }).catch(() => null);
    await browser.wait(8000);
    
    // Check if login succeeded Boss!
    const currentUrl = page.url();
    if (currentUrl.includes('sign_in') || currentUrl.includes('login')) {
      const errMsg = await page.evaluate(() => {
        const err = document.querySelector('.ds-form-item__error, .error-message, [class*="error"]');
        return err ? err.innerText : 'Unknown error';
      }).catch(() => 'Login page still visible');
      logger.error(`❌ DeepSeek Login Failed: ${errMsg}`);
      throw new Error(`Login failed: ${errMsg}`);
    }
    
    logger.info('✔ DeepSeek Login SUCCESS! Session Saved. 🛡️💎');
  }

  async scrapeResponse(page, onStream) {
    logger.info('⏳ Waiting for DeepSeek to finish generating...');
    let lastStreamed = "";
    let stableCount = 0; // 🛡️ Stability counter

    for (let i = 0; i < 60; i++) {
        await browser.wait(1500);

        // 📡 Stream content live Boss!
        const currentContent = await page.evaluate(() => {
          const msgs = document.querySelectorAll('.ds-markdown');
          if (msgs.length === 0) return '';
          return msgs[msgs.length - 1].innerText.trim();
        }).catch(() => "");

        if (currentContent && currentContent.length > lastStreamed.length) {
           if (onStream) await onStream(currentContent);
           lastStreamed = currentContent;
           stableCount = 0; // Reset stability, it's still typing!
        } else if (currentContent && currentContent.length > 20 && currentContent === lastStreamed) {
           stableCount++; // Text hasn't grown!
        }

        // 🛡️ BATTLE TEST: If it hasn't grown for 3 iterations (4.5 seconds), it's completely done!
        if (stableCount >= 2) {
           logger.info(`✔ DeepSeek stabilized and finished (iteration ${i + 1})`);
           break;
        }

        if (i % 3 === 0) logger.info(`⏳ Generating... (${i * 1.5}s elapsed, length: ${currentContent.length})`);
    }

    // Capture the final complete text one last time just to be absolutely sure Boss! 
    const fullContent = await page.evaluate(() => {
      const msgs = document.querySelectorAll('.ds-markdown');
      if (msgs.length === 0) return '';
      return msgs[msgs.length - 1].innerText.trim();
    });

    if (fullContent && fullContent.length > lastStreamed.length && onStream) {
      await onStream(fullContent);
    }

    logger.info(`✔ Full response captured: ${fullContent.length} characters`);
    return fullContent || 'Boss, response varalai. Try again!';
  }
}

export const deepSeek = new DeepSeekService();
