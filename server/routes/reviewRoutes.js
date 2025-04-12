const express = require('express');
const router = express.Router();
const { 
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getUserReviews,
  searchReviews
} = require('../controllers/reviewController');

// Review routes
router.get('/', getAllReviews);
router.get('/user', getUserReviews);
router.get('/search', searchReviews);
router.get('/:id', getReviewById);
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/like', likeReview);

module.exports = router; 