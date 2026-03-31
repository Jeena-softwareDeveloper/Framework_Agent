import { browser } from './browserService.js';
import { logger } from '../utils/logger.js';
import { telegram } from './telegramService.js';

class InstagramService {
  constructor() {
    this.instagramUrl = 'https://www.instagram.com/accounts/login/';
    this.isLoggedIn = false;
  }

  /**
   * 🛡️ HUMAN LOGIN ENGINE Boss! 👤⚡🚀
   * It mimics exactly how a person would login to avoid shadowbans.
   */
  async login(username, password) {
    logger.info(`👤 Attempting IG Login for: ${username} Boss! 🛡️🧿`);
    
    try {
      const page = await browser.init();
      
      // 1. 🌐 GO TO LOGIN
      await browser.navigate(this.instagramUrl);
      await browser.wait(Math.floor(Math.random() * 3000) + 2000); // 🛡️ HUMAN PAUSE

      // 2. 🛡️ CHECK FOR COOKIES MODAL Boss!
      const cookieButton = await page.$('button._a9--._a9_0, button._a9--._a9_1');
      if (cookieButton) {
          logger.info('🍪 Handling Cookie Popup Boss!');
          await cookieButton.click();
          await browser.wait(1000);
      }

      // 3. ⌨️ TYPE USERNAME Boss!
      await page.waitForSelector('input[name="username"]', { timeout: 30000 });
      const userField = await page.$('input[name="username"]');
      await userField.click();
      await browser.wait(500);
      
      // Type like a human Boss!
      for (const char of username) {
        await page.keyboard.sendCharacter(char);
        await browser.wait(Math.floor(Math.random() * 150) + 50);
      }

      await browser.wait(Math.floor(Math.random() * 1000) + 500); // Wait before password

      // 4. ⌨️ TYPE PASSWORD Boss!
      const passField = await page.$('input[name="password"]');
      await passField.click();
      await browser.wait(300);
      
      for (const char of password) {
        await page.keyboard.sendCharacter(char);
        await browser.wait(Math.floor(Math.random() * 150) + 50);
      }

      await browser.wait(Math.floor(Math.random() * 1200) + 800);

      // 5. 🖱️ CLICK LOGIN
      await page.click('button[type="submit"]');
      logger.info('💎 Login triggered! Waiting for SPA redirect Boss...');

      // 6. ⏳ WAIT FOR FEED
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null);
      await browser.wait(5000);

      // 7. 🛡️ HANDLE POPUPS (Save Info, Notifications)
      await this.handlePostLoginPopups(page);

      // 8. ✅ VERIFY LOGIN
      const isLoggedIn = await page.evaluate(() => !!document.querySelector('svg[aria-label="Direct Messaging"], ._af36'));
      this.isLoggedIn = isLoggedIn;
      
      if (isLoggedIn) {
        logger.info(`✔ Instagram Successfully Logged In as ${username}! 🛡️🚀`);
        return true;
      } else {
        logger.warn('❌ Instagram Login verification failed Boss!');
        return false;
      }

    } catch (e) {
      logger.error(`❌ IG Login Error: ${e.message}`);
      return false;
    }
  }

  async handlePostLoginPopups(page) {
     // Save Info? "Not Now"
     const notNowSelectors = [
         'button._a9--._a9_1', // Notifications Not Now
         'div[role="button"]:has-text("Not Now")', 
         'button:has-text("Not Now")'
     ];
     
     for (const selector of notNowSelectors) {
         try {
             const btn = await page.evaluateHandle((s) => {
                 const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
                 return buttons.find(b => b.innerText.includes("Not Now"));
             });
             if (btn && typeof btn.click === 'function') {
                 logger.info('🛡️ Clearing post-login popups Boss!');
                 await btn.click();
                 await browser.wait(2000);
             }
         } catch(e) {}
     }
  }

  /**
   * 🛡️ REAL HUMAN ACTION ENGINE 👤⚡🧬
   * Scrolls, pauses, and looks at things to build session authority Boss!
   */
  async actHuman() {
    if (!this.isLoggedIn) return logger.warn('🛡️ Boss, login pannama human mari act panna mudiyathu!');
    
    logger.info('🧬 Acting like a real human... Browsing feed Boss! 🛡️🧿');
    const page = await browser.init();
    
    // Scroll a bit
    for (let i = 0; i < 3; i++) {
       await browser.scroll('down', Math.floor(Math.random() * 400) + 300);
       await browser.wait(Math.floor(Math.random() * 3000) + 2000); // 🛡️ HUMAN PAUSE
       
       // Sometime like a post (safe like Boss!)
       if (Math.random() > 0.7) {
          logger.info('❤ Liking a post naturally Boss!');
          await page.evaluate(() => {
              const hearts = Array.from(document.querySelectorAll('svg[aria-label="Like"]'));
              if (hearts.length > 0) hearts[0].closest('button').click();
          });
          await browser.wait(1500);
       }
    }
    
    logger.info('✔ Finished browsing like a human Boss! 🛡️⚡');
  }
}

export const instagram = new InstagramService();
