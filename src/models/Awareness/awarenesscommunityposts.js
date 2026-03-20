import mongoose from 'mongoose';

const awarenesscommunitypostsSchema = new mongoose.Schema({
  authorName: { type: String },
  authorId: { type: Object },
  isVerified: { type: Boolean },
  title: { type: String },
  content: { type: String },
  crop: { type: String },
  votes: { type: Number },
  likedBy: { type: Array },
  dislikedBy: { type: Array },
  image: { type: String },
  isActive: { type: Boolean },
  comments: { type: Array },
  createdAt: { type: Object },
  updatedAt: { type: Object },
}, { timestamps: true });

export const Awarenesscommunityposts = mongoose.model('awarenesscommunityposts', awarenesscommunitypostsSchema);
