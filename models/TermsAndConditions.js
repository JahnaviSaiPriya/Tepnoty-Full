const mongoose = require('mongoose');

const termsAndConditionsSchema = new mongoose.Schema({
  content: { type: String, required: true }, 
});

const TermsAndConditions = mongoose.model('TermsAndConditions', termsAndConditionsSchema);

module.exports = TermsAndConditions;
