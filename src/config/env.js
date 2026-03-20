import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SERPAPI_API_KEY: process.env.SERPAPI_API_KEY,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lead_agent',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};

export const validateEnv = () => {
  const required = ['GROQ_API_KEY', 'GEMINI_API_KEY'];
  required.forEach(key => {
    if (!ENV[key] || ENV[key].includes('your_')) {
      console.warn(`[WARNING] Missing ${key} in .env`);
    }
  });
};
