// src/models/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadModels = async (dir = __dirname) => {
  let count = 0;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      await loadModels(fullPath);
    } else if (item.endsWith('.js') && item !== 'index.js') {
      const relPath = path.relative(__dirname, fullPath).replace(/\\/g, '/');
      await import(`./${relPath}`);
      count++;
    }
  }
  if (dir === __dirname) console.log('All models loaded into memory.');
};
