const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaPath: { type: String }, // Local file path
  type: { type: String, enum: ['image', 'video', 'text'], required: true },
  text: { type: String },  // Only if type is 'text'
  createdAt: { type: Date, default: Date.now, expires: '24h' },  // Automatically delete after 24 hours
});

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
