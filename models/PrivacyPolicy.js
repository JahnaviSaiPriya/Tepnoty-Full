const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  content: { type: String, required: true }, 
});

const privacyPolicy = mongoose.model('privacy', privacySchema);

module.exports = privacyPolicy;
