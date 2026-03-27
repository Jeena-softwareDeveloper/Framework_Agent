// src/routes/api.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Fetch Hub Statistics for the Web Dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = {
        farmers: await mongoose.model('farmers').countDocuments().catch(() => 0),
        users: await mongoose.model('users').countDocuments().catch(() => 0),
        products: await mongoose.model('products').countDocuments().catch(() => 0),
        total_leads: await mongoose.model('leads').countDocuments().catch(() => 0),
        collections: (await mongoose.connection.db.listCollections().toArray().catch(() => [])).length
    };
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
