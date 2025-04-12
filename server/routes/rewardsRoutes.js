const express = require('express');
const router = express.Router();
const { 
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
  getUserRewards
} = require('../controllers/rewardController');

// Rewards routes
router.get('/', getAllRewards);
router.get('/user', getUserRewards);
router.get('/:id', getRewardById);
router.post('/', createReward);
router.patch('/:id', updateReward);
router.delete('/:id', deleteReward);
router.post('/:id/redeem', redeemReward);

module.exports = router; 