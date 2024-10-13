const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // text, image, video
  text: { type: String }, // Only for text status
  backgroundColor: { type: String }, // Optional, for text statuses
  fontSize: { type: String }, // Optional, for text statuses
  fontStyle: { type: String }, // Optional, for text statuses
  mediaPath: { type: String }, // For images or videos
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
