import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2:1b',
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
  const required = ['OLLAMA_MODEL'];
  required.forEach(key => {
    if (!ENV[key]) {
      console.warn(`[WARNING] Missing ${key} in .env`);
    }
  });
};
