import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function listAllModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const response = await axios.get(url);
  fs.writeFileSync('d:/access/Agent-Framework/tmp/models-list.json', JSON.stringify(response.data, null, 2));
  console.log("Done writing to models-list.json");
}

listAllModels();
