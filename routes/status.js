const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Status = require('../models/Status');
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

// POST /status: Upload a new status
router.post('/status', authenticate, upload.single('media'), async (req, res) => {
  try {
    const { type, text } = req.body;
    let mediaPath = '';

    if (type === 'image' || type === 'video') {
      if (!req.file) {
        return res.status(400).json({ error: 'Media file is required for image or video status' });
      }
      mediaPath = req.file.path;  // Save the local file path
    }

    const newStatus = new Status({
      userId: req.user._id,  // Assuming `req.user` is populated by the authenticate middleware
      mediaPath,
      type,
      text: type === 'text' ? text : undefined,
    });

    await newStatus.save();
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

module.exports = router;

/*
GET status 
localhost:4008/api/statuses 
Token required

POST status
localhost:4008/api/status
Token required
{
    "type" : "text",
    "text" : "Hello World"
}
*/