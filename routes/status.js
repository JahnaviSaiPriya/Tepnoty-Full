const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Status = require('../models/Status');
const StatusHistory = require('../models/StatusHistory'); 
const User = require('../models/user');
const authenticate = require('../middleware/authMiddleware.js');
const router = express.Router();

// Set up multer to save files locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/status');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// POST /status: Upload a new status and save to both Status and StatusHistory
router.post('/status', authenticate, upload.single('media'), async (req, res) => {
  try {
    const { type, text, backgroundColor, fontSize, fontStyle } = req.body;
    let mediaPath = '';

    if (type === 'image' || type === 'video') {
      if (!req.file) {
        return res.status(400).json({ error: 'Media file is required for image or video status' });
      }
      mediaPath = req.file.path; // Save the local file path
    }

    // Save the status for 24-hour visibility
    const newStatus = new Status({
      userId: req.user._id,
      mediaPath,
      type,
      text: type === 'text' ? text : undefined,
      backgroundColor: type === 'text' ? backgroundColor : undefined,
      fontSize: type === 'text' ? fontSize : undefined,
      fontStyle: type === 'text' ? fontStyle : undefined,
    });
    await newStatus.save();

    // Save the status in the user's profile history
    const newStatusHistory = new StatusHistory({
      userId: req.user._id,
      mediaPath,
      type,
      text: type === 'text' ? text : undefined,
      backgroundColor: type === 'text' ? backgroundColor : undefined,
      fontSize: type === 'text' ? fontSize : undefined,
      fontStyle: type === 'text' ? fontStyle : undefined,
    });
    await newStatusHistory.save();

    res.status(201).json({ message: 'Status uploaded successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload status' });
  }
});


// GET /statuses: Get statuses of the user and their connections
router.get('/statuses', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    // Fetch user's connections
    const user = await User.findById(userId).populate('connections');
    const connectionIds = user.connections.map(conn => conn._id);
    // Fetch statuses of the user and their connections
    const statuses = await Status.find({ userId: { $in: [userId, ...connectionIds] } })
      .sort({ createdAt: -1 });

    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statuses' });
  }
});

router.get('/user-history', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch all status history for the user
    const statusHistory = await StatusHistory.find({ userId })
      .sort({ createdAt: -1 });

    if (statusHistory.length === 0) {
      return res.status(404).json({ message: 'No history found' });
    }

    res.status(200).json(statusHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status history' });
  }
});
module.exports = router;

/*
GET status 
localhost:4008/api/statuses 
Token required

POST status
localhost:4008/api/status
Token required
{
  "type": "text",
  "text": "Hello World!",
  "backgroundColor": "#FFFFFF",
  "fontSize": "16px",
  "fontStyle": "bold"
}

*/