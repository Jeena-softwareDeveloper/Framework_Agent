import mongoose from 'mongoose';

const globalsettingsSchema = new mongoose.Schema({
  key: { type: String },
  value: { type: Object },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Globalsettings = mongoose.model('globalsettings', globalsettingsSchema);
