const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');

const router = express.Router();

// Setup Multer for file uploads, storing files locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOADS_DIR || 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

// POST endpoint to create a new post
router.post('/post', upload.single('media'), async (req, res) => {
  try {
    const { type, text } = req.body;
    console.log(req.body)
    let mediaUrl = '';

    // Save the uploaded file locally
    if (type === 'image' || type === 'video') {
      const file = req.file;
      console.log("File : ",file)
      if (!file) {
        return res.status(400).json({ error: 'Media file is required for image/video posts' });
      }
      // Create the local media URL
      mediaUrl = path.join(process.env.UPLOADS_DIR, file.filename);
    }

    // Create a new post
    const newPost = new Post({
      adminId: 'admin-id', // Replace with dynamic admin ID
      mediaUrl,
      type,
      text: type === 'text' ? text : undefined,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET endpoint to fetch all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router; 

/* 
GET posts
localhost:4008/api/posts

POST posts
localhost:4008/api/post
{
    "type" : "text",
    "text" : "Hello World"
}
*/
