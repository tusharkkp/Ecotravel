const express = require('express');
const router = express.Router();
const { 
  register,
  login
} = require('../controllers/userController');
const { validateToken } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', validateToken);

module.exports = router; 