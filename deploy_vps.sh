#!/bin/bash
cd /root/Framework_Agent
cat <<EOF > .env
GEMINI_API_KEY=AIzaSyB7_vN2H2D2S2z2D2S2z2D2S2z2D2S2z2D
GROQ_API_KEY=gsk_7jU7H9jX1z2H2D2S2z2D2S2z2D2S2z2D2S2z2D
MONGODB_URI=mongodb+srv://jeena-software-developer:Jeena.1234@cluster0.p718f.mongodb.net/jeenora?retryWrites=true&w=majority&appName=Cluster0
TELEGRAM_BOT_TOKEN=8014524458:AAHjB9vLAsH7n7lJg8-5g_85uXN6vI4XN6s
TELEGRAM_CHAT_ID=8791408460
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
EMAIL_USER=info@jeenora.com
EMAIL_PASSWORD=Jeena.1234
EOF
npm install
pm2 delete all || true
pm2 start src/index.js --name jenoora-ceo
pm2 save
pm2 list
