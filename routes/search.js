// http://localhost:3000/api/users/search?name=John 
// http://localhost:3000/api/users/search?user_id=user12345

const express = require('express');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Search users by name or user_id
router.get('/users/search', async (req, res) => {
  try {
    const { name, user_id } = req.query; // Get search query parameters
    // console.log(name)
    // Build search filter
    const searchFilter = {};
    
    if (name) {
      // Case-insensitive partial match for name
      searchFilter.name = new RegExp(name, 'i');
    }

    if (user_id) {
      // Exact match for user_id
      searchFilter.user_id = user_id;
    }

    // Find users based on the search filter
    const users = await User.find(searchFilter);

    // If no users found, return a message
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the search results
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users', message: error.message });
  }
});

module.exports = router;

/* 
(query parameters - name, user_id)

name can be match partially
localhost:4008/api/users/search?name=ja

user_id should be exactly matched
localhost:4008/api/users/search?user_id=janu
*/