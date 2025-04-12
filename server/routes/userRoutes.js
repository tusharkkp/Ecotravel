const express = require('express');
const router = express.Router();
const { 
  register,
  login,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, restrictTo, validateToken } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', validateToken);

// User profile routes - protected by authentication
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);

// Admin routes - protected by authentication and authorization
router.get('/', protect, restrictTo('admin'), getAllUsers);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router; 