
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

async function testConnectivity() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("❌ GEMINI_API_KEY missing!");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidates = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];

  console.log("🔍 Testing Model Connectivity Boss...");

  for (const modelName of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you available?");
      console.log(`✅ ${modelName}: AVAILABLE (${result.response.text().substring(0, 15)}...)`);
    } catch (e) {
      console.log(`❌ ${modelName}: FAILED (${e.message.substring(0, 50)}...)`);
    }
  }
}

testConnectivity();
