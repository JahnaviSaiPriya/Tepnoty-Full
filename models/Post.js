const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  mediaUrl: { type: String },
  type: { type: String, enum: ['image', 'video', 'text'], required: true },
  text: { type: String }, // Only if type is 'text'
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

