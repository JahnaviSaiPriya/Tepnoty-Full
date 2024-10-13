const express = require('express');
const StatusView = require('../models/StatusView')
const router = express.Router(); 
const authenticate = require('../middleware/authMiddleware'); 

// POST /status-view: Log a view of a user's status
router.post('/status-view', authenticate, async (req, res) => {
  try {
    const { statusOwnerId } = req.body;  // ID of the status owner (the person whose status is being viewed)
    const viewerId = req.user._id;  // ID of the user who is viewing the status

    // Check if the viewer is not viewing their own status
    if (viewerId.toString() === statusOwnerId) {
      return res.status(200).json({ message: 'You viewed your own status.' });
    }

    // Check if the view already exists, to avoid multiple entries for the same viewer
    let existingView = await StatusView.findOne({
      viewedBy: viewerId,
      statusOwner: statusOwnerId,
    });

    if (existingView) {
      // If the view already exists, update the `viewedAt` timestamp to the current time
      existingView.viewedAt = new Date();
      await existingView.save();
    } else {
      // If this is the first time the viewer is viewing the status, create a new record
      const newView = new StatusView({
        viewedBy: viewerId,
        statusOwner: statusOwnerId,
        viewedAt: new Date(), // Automatically set to the current time
      });
      await newView.save();
    }

    res.status(201).json({ message: 'Status view logged successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log status view', details: error.message });
  }
});

// GET /status-viewers/:userId: Fetch the viewers of a specific user's statuses
router.get('/status-viewers/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;  // ID of the status owner

    // Fetch all viewers of the user's statuses, populate the details of the viewers
    const viewers = await StatusView.find({ statusOwner: userId })
      .populate('viewedBy', 'name')  
      .sort({ viewedAt: -1 });  

    if (!viewers || viewers.length === 0) {
      return res.status(200).json({ message: 'No viewers found for this status.' });
    }

    res.status(200).json(viewers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status viewers', details: error.message });
  }
});

module.exports = router;
