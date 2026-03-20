// notify_split.js
import { telegram } from './src/services/telegramService.js';

async function notify() {
    console.log('Sending split summary to Telegram...');

    const summary = `
📦 *PROJECT RE-STRUCTURE COMPLETE*

The 89 models have been organized into 5 logical modules:

1️⃣ *AWARENESS MODULE*
(Content, AI Doctor, Farmers, etc.)
• 14 Collections

2️⃣ *HIRE MODULE*
(Jobs, Profiles, Resumes, etc.)
• 14 Collections

3️⃣ *WEAR MODULE*
(Products, Shop, Sellers, Orders, etc.)
• 22 Collections

4️⃣ *ANALYTICS MODULE*
(Events, Sessions, Predictions, etc.)
• 8 Collections

5️⃣ *CORE & SECURITY*
(Admin, Chat, Auth, Settings, etc.)
• 31 Collections

📂 *Structure:* \`/src/models/[Module]/[Model].js\`
✅ The bot logic and models are now fully optimized for module-based scaling.
`;

    await telegram.sendMessage(summary);
    console.log('Split summary sent!');
}

notify();
