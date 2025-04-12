const CarbonCalculation = require('../models/carbonCalculationModel');

// Emission factors (would ideally come from a database or external API)
const emissionFactors = {
  transportation: {
    flight: 0.255, // kg CO2e per km per person
    train: 0.041,
    bus: 0.027,
    car: 0.17,
    boat: 0.19
  },
  accommodation: {
    hotel: 15, // kg CO2e per night
    hostel: 5,
    apartment: 8,
    camping: 2
  },
  activities: {
    tour: 4, // kg CO2e per activity
    adventure: 6,
    cultural: 2,
    leisure: 3
  }
};

// Calculate carbon emissions
exports.calculateCarbon = async (req, res) => {
  try {
    const { transportation, accommodations, activities, tripName } = req.body;
    
    // Calculate transportation emissions
    let transportationEmissions = 0;
    if (transportation && transportation.length > 0) {
      transportationEmissions = transportation.reduce((total, item) => {
        const factor = emissionFactors.transportation[item.type] || 0.2;
        const emissions = factor * item.distance.value / (item.passengers || 1);
        return total + emissions;
      }, 0);
    }
    
    // Calculate accommodation emissions
    let accommodationEmissions = 0;
    if (accommodations && accommodations.length > 0) {
      accommodationEmissions = accommodations.reduce((total, item) => {
        const factor = emissionFactors.accommodation[item.type] || 10;
        const emissions = factor * item.nights;
        return total + emissions;
      }, 0);
    }
    
    // Calculate activity emissions
    let activityEmissions = 0;
    if (activities && activities.length > 0) {
      activityEmissions = activities.reduce((total, item) => {
        const factor = emissionFactors.activities[item.type] || 3;
        return total + factor;
      }, 0);
    }
    
    // Calculate total emissions
    const totalEmissions = transportationEmissions + accommodationEmissions + activityEmissions;
    
    // Generate recommendations
    const recommendations = [];
    
    if (transportationEmissions > 0) {
      recommendations.push({
        category: 'transportation',
        suggestion: 'Consider using trains instead of flights for shorter distances',
        potentialSavings: transportationEmissions * 0.3
      });
    }
    
    if (accommodationEmissions > 0) {
      recommendations.push({
        category: 'accommodation',
        suggestion: 'Choose eco-certified hotels or hostels',
        potentialSavings: accommodationEmissions * 0.2
      });
    }
    
    // Calculate potential savings
    const potentialSavings = recommendations.reduce((total, rec) => total + rec.potentialSavings, 0);
    
    // Create carbon calculation record
    const calculation = await CarbonCalculation.create({
      user: req.body.user || '650d17b9389d8e28b9c86b1a', // For demo purposes
      tripName: tripName || 'My Trip',
      transportation: transportation.map(item => ({
        ...item,
        emissions: item.emissions || (emissionFactors.transportation[item.type] || 0.2) * item.distance.value / (item.passengers || 1)
      })),
      accommodations: accommodations.map(item => ({
        ...item,
        emissions: item.emissions || (emissionFactors.accommodation[item.type] || 10) * item.nights
      })),
      activities: activities.map(item => ({
        ...item,
        emissions: item.emissions || (emissionFactors.activities[item.type] || 3)
      })),
      totalEmissions,
      potentialSavings,
      recommendations
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        calculation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get user's calculations
exports.getUserCalculations = async (req, res) => {
  // This would be implemented with auth middleware
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
    data: {
      calculations: []
    }
  });
};

// Get single calculation
exports.getSingleCalculation = async (req, res) => {
  try {
    const calculation = await CarbonCalculation.findById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No calculation found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        calculation
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update calculation
exports.updateCalculation = async (req, res) => {
  // This would be implemented with auth middleware
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
    data: {
      calculation: {}
    }
  });
};

// Delete calculation
exports.deleteCalculation = async (req, res) => {
  // This would be implemented with auth middleware
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented'
  });
};

// Get emission factors
exports.getEmissionFactors = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      emissionFactors
    }
  });
}; 