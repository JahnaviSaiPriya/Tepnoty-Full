const mongoose = require('mongoose');

const statusViewSchema = new mongoose.Schema({
  viewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who viewed
  statusOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Status being viewed
  viewedAt: { type: Date, default: Date.now } // Timestamp of view
});

module.exports = mongoose.model('StatusView', statusViewSchema);

