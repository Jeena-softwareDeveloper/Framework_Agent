import mongoose from 'mongoose';

const awarenessguidecategoriesSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenessguidecategories = mongoose.model('awarenessguidecategories', awarenessguidecategoriesSchema);
