const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the certification name'],
    trim: true
  },
  provider: {
    type: String,
    required: [true, 'Please provide the provider name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please specify the certification type'],
    enum: ['accommodation', 'transportation', 'activity']
  },
  ecoRating: {
    type: Number,
    required: [true, 'Please provide an eco rating'],
    min: 1,
    max: 5
  },
  criteria: [{
    name: String,
    description: String,
    score: Number
  }],
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  website: String,
  description: String,
  images: [String],
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geographical searches
certificationSchema.index({ 'location.coordinates': '2dsphere' });

const Certification = mongoose.model('Certification', certificationSchema);
module.exports = Certification; 