const express = require('express');
const privacyPolicy = require('../models/PrivacyPolicy');

const router = express.Router();

// Create a new Privacy policy
router.post('/newPolicy', async (req, res) => {
  try {
    const content  = req.body;
    const newTerms = new privacyPolicy({ content });
    await newTerms.save();
    res.status(201).json({ message: 'Policy created successfully.', newTerms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Privacy policy' });
  }
});

// Get all Privacy policies
router.get('/policies', async (req, res) => {
  try {
    const terms = await privacyPolicy.find();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Privacy policies' });
  }
});

// Edit an existing Privacy policy by ID
router.put('/editPolicy/:id', async (req, res) => {
  try {
    const content  = req.body;
    const updatedTerms = await privacyPolicy.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true } // Return the updated document
    );

    if (!updatedTerms) {
      return res.status(404).json({ message: 'Privacy policy not found' });
    }

    res.status(200).json({ message: 'Privacy policies updated successfully.', updatedTerms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Privacy policies' });
  }
});

// Delete a Privacy policy by ID
router.delete('/deletePolicy/:id', async (req, res) => {
  try {
    const deletedTerms = await privacyPolicy.findByIdAndDelete(req.params.id);

    if (!deletedTerms) {
      return res.status(404).json({ message: 'Privacy policies not found' });
    }

    res.status(200).json({ message: 'Privacy policies deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Privacy policies' });
  }
});

module.exports = router;
