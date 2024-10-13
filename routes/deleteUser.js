const express = require('express');
const User = require('../models/user');
const DeletedUser = require('../models/DeleteAccount'); 
const authenticate = require('../middleware/authMiddleware'); 
const router = express.Router();

// DELETE /deleteAccount: Delete user account
router.delete('/deleteAccount', authenticate, async (req, res) => {
  try {
    const userId = req.user._id; 

    // Find the user to be deleted
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new DeletedUser entry
    const deletedUser = new DeletedUser({
      userId: user.user_id, 
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    // Save the deleted user details to DeletedUser collection
    await deletedUser.save();

    // Delete the user from the User collection
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account', message: error.message });
  }
});

module.exports = router;
