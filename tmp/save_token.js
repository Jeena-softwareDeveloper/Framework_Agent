
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

const vaultSchema = new mongoose.Schema({
  service: String,
  username: String,
  password: { type: String, select: true },
  updatedAt: Date
});

async function saveToken() {
  try {
    await mongoose.connect(process.env.DB_URL);
    const Vault = mongoose.model('Vault', vaultSchema);
    
    await Vault.findOneAndUpdate(
      { service: 'github' },
      { 
        service: 'github', 
        username: 'jeenoraofficial', 
        password: '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', 
        updatedAt: new Date() 
      },
      { upsert: true }
    );
    
    console.log("✅ GITHUB_TOKEN successfully injected into Vault Boss!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Vault injection failed:", err);
    process.exit(1);
  }
}

saveToken();
