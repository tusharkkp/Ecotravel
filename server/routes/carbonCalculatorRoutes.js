const express = require('express');
const router = express.Router();
const { 
  calculateCarbon,
  getUserCalculations,
  getSingleCalculation,
  updateCalculation,
  deleteCalculation,
  getEmissionFactors
} = require('../controllers/carbonCalculatorController');

// Carbon calculation routes
router.post('/', calculateCarbon);
router.get('/', getUserCalculations);
router.get('/factors', getEmissionFactors);
router.get('/:id', getSingleCalculation);
router.patch('/:id', updateCalculation);
router.delete('/:id', deleteCalculation);

module.exports = router; 