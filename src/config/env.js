import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MONGODB_URI: process.env.DB_URL,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  AUTONOMOUS_ENABLED: process.env.AUTONOMOUS_ENABLED === 'true',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};

export const validateEnv = () => {
  const required = ['GEMINI_API_KEY'];
  required.forEach(key => {
    if (!ENV[key] || ENV[key].includes('your_')) {
      console.warn(`[WARNING] Missing ${key} in .env`);
    }
  });
};
