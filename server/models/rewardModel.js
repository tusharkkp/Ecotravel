const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Reward must have a name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Reward must have a description']
  },
  type: {
    type: String,
    enum: ['badge', 'discount', 'coupon', 'perk', 'achievement'],
    required: [true, 'Please specify the reward type']
  },
  pointCost: {
    type: Number,
    required: [true, 'Reward must have a point cost']
  },
  value: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['transportation', 'accommodation', 'activity', 'general'],
    required: [true, 'Please specify the reward category']
  },
  image: String,
  partner: {
    name: String,
    website: String,
    logo: String
  },
  validFrom: Date,
  validUntil: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  redemptionLimit: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  redemptionCount: {
    type: Number,
    default: 0
  },
  conditions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for availability status
rewardSchema.virtual('isAvailable').get(function() {
  if (!this.isActive) return false;
  if (this.redemptionLimit !== -1 && this.redemptionCount >= this.redemptionLimit) return false;
  
  const now = new Date();
  if (this.validFrom && this.validFrom > now) return false;
  if (this.validUntil && this.validUntil < now) return false;
  
  return true;
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward; 