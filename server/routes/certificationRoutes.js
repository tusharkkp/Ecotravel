const express = require('express');
const router = express.Router();
const { 
  getAllCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  searchCertifications
} = require('../controllers/certificationController');

// Certification routes
router.get('/', getAllCertifications);
router.get('/search', searchCertifications);
router.get('/:id', getCertificationById);
router.post('/', createCertification);
router.patch('/:id', updateCertification);
router.delete('/:id', deleteCertification);

module.exports = router; 