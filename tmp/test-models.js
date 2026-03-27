import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("Using API Key:", process.env.GEMINI_API_KEY ? "FOUND (" + process.env.GEMINI_API_KEY.slice(0, 5) + "...) " : "NOT FOUND");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-thinking-exp",
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash"
  ];

  console.log("🔍 Checking available models...\n");

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("hi");
      const response = await result.response;
      console.log(`✅ ${modelName}: SUCCESS - ${response.text().trim().substring(0, 20)}...`);
    } catch (e) {
      console.log(`❌ ${modelName}: FAILED - ${e.message}`);
    }
  }
}

testModels();
