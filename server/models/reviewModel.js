const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  title: {
    type: String,
    required: [true, 'Review must have a title'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Review must have content']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating']
  },
  type: {
    type: String,
    required: [true, 'Please specify the review type'],
    enum: ['accommodation', 'transportation', 'activity', 'location', 'tip']
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [String],
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for comments on reviews
reviewSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'review',
  localField: '_id'
});

// Index for geographical searches
reviewSchema.index({ 'location.coordinates': '2dsphere' });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review; 