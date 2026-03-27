import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  tools: [{
    functionDeclarations: [{
      name: "webSearch",
      description: "Search the web",
      parameters: {
        type: "OBJECT",
        properties: { query: { type: "STRING" } },
        required: ["query"]
      }
    }]
  }],
  systemInstruction: "You are Jeenora CEO. Speak in Tanglish. Call user Boss."
});

console.log("🧪 Testing gemini-2.5-flash...");

try {
  const chat = model.startChat();
  const result = await chat.sendMessage("Jeenora brand visibility about sollu Boss");
  const response = result.response;
  
  const fnCalls = response.functionCalls();
  if (fnCalls && fnCalls.length > 0) {
    console.log("✅ Tool calling works! AI called:", fnCalls[0].name, "with args:", fnCalls[0].args);
  } else {
    console.log("✅ Direct response:", response.text().substring(0, 200));
  }
  console.log("\n🎉 gemini-2.5-flash is WORKING! Switch panna ready!");
} catch (e) {
  console.error("❌ Error:", e.message);
}
