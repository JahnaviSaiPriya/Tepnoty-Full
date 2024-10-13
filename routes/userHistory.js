const express = require('express');
const StatusHistory = require('../models/StatusHistory'); 
const router = express.Router(); 
const authenticate = require('../middleware/authMiddleware'); 

router.get('/user-history', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current date and calculate the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Start of today's date

    // Calculate one week ago from today
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // Fetch statuses posted between one week ago and before today
    const statusHistory = await StatusHistory.find({
      userId,
      createdAt: {
        $gte: oneWeekAgo, // Greater than or equal to one week ago
        $lt: today        // Less than today (excluding today's statuses)
      }
    }).sort({ createdAt: -1 });

    if (statusHistory.length === 0) {
      return res.status(404).json({ message: 'No history found for the last week' });
    }

    res.status(200).json(statusHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status history' });
  }
});

module.exports = router;
