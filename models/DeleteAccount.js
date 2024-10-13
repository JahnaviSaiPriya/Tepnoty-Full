const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Unique ID of the deleted user
  name: { type: String, required: true }, // Name of the deleted user
  email: { type: String, required: true }, // Email of the deleted user
  phoneNumber: { type: String, required: true }, // Phone number of the deleted user
  deletedAt: { type: Date, default: Date.now }, // Timestamp of when the account was deleted
}, { timestamps: true });

module.exports = mongoose.model('DeleteAccount', deletedUserSchema);
