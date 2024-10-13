const express = require('express');
const TermsAndConditions = require('../models/TermsAndConditions');

const router = express.Router();

// Create a new terms and conditions
router.post('/newTerm', async (req, res) => {
  try {
    const content  = req.body;
    const newTerms = new TermsAndConditions({ content });
    await newTerms.save();
    res.status(201).json({ message: 'Terms and conditions created successfully.', newTerms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create terms and conditions' });
  }
});

// Get all terms and conditions
router.get('/terms', async (req, res) => {
  try {
    const terms = await TermsAndConditions.find();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch terms and conditions' });
  }
});

// Edit an existing terms and conditions by ID
router.put('/editTerm/:id', async (req, res) => {
  try {
    const content  = req.body;
    const updatedTerms = await TermsAndConditions.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true } // Return the updated document
    );

    if (!updatedTerms) {
      return res.status(404).json({ message: 'Terms and conditions not found' });
    }

    res.status(200).json({ message: 'Terms and conditions updated successfully.', updatedTerms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update terms and conditions' });
  }
});

// Delete a terms and conditions by ID
router.delete('/deleteTerm/:id', async (req, res) => {
  try {
    const deletedTerms = await TermsAndConditions.findByIdAndDelete(req.params.id);

    if (!deletedTerms) {
      return res.status(404).json({ message: 'Terms and conditions not found' });
    }

    res.status(200).json({ message: 'Terms and conditions deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete terms and conditions' });
  }
});

module.exports = router;
