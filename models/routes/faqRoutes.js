// routes/faqRoutes.js
const express = require('express');
const { getFAQs, getFAQById, createFAQ, deleteFAQ } = require('../controllers/faqController');
const router = express.Router();

// Define routes for FAQ operations
router.get('/faqs', getFAQs);  // Get all FAQs
router.get('/faqs/:id', getFAQById);  // Get a specific FAQ by ID
router.post('/faqs', createFAQ);  // Create a new FAQ
router.delete('/faqs/:id', deleteFAQ);  // Delete an FAQ

module.exports = router;
