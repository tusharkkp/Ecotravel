const mongoose = require('mongoose');

const carbonCalculationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Carbon calculation must belong to a user']
  },
  tripName: {
    type: String,
    required: [true, 'Please provide a name for this trip'],
    trim: true
  },
  transportation: [{
    type: {
      type: String,
      required: [true, 'Please specify transportation type'],
      enum: ['flight', 'train', 'bus', 'car', 'boat', 'other']
    },
    distance: {
      value: Number,
      unit: {
        type: String,
        enum: ['km', 'miles'],
        default: 'km'
      }
    },
    passengers: {
      type: Number,
      default: 1
    },
    emissions: Number // in kg CO2e
  }],
  accommodations: [{
    type: {
      type: String,
      enum: ['hotel', 'hostel', 'apartment', 'camping', 'other']
    },
    nights: Number,
    ecoRating: {
      type: Number,
      min: 1,
      max: 5
    },
    emissions: Number // in kg CO2e
  }],
  activities: [{
    type: {
      type: String,
      enum: ['tour', 'adventure', 'cultural', 'leisure', 'other']
    },
    emissions: Number // in kg CO2e
  }],
  totalEmissions: {
    type: Number,
    required: [true, 'Total emissions must be calculated']
  },
  potentialSavings: {
    type: Number,
    default: 0
  },
  recommendations: [{
    category: {
      type: String,
      enum: ['transportation', 'accommodation', 'activity']
    },
    suggestion: String,
    potentialSavings: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CarbonCalculation = mongoose.model('CarbonCalculation', carbonCalculationSchema);
module.exports = CarbonCalculation; 