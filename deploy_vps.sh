#!/bin/bash
cd /root/Framework_Agent
git pull origin main
npm install --production
pm2 delete jenoora-ceo || true
pm2 start src/index.js --name jenoora-ceo
pm2 save
pm2 list
