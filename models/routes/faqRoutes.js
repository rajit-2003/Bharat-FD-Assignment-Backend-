// routes/faqRoutes.js

const express = require('express');
const FAQ = require('../models/faqModel');

const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find(); // Retrieve all FAQs
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get FAQ by ID and support language selection
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || req.user.preferredLanguage || 'en'; // Get preferred language from JWT or query parameter
  
  try {
    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    const translatedQuestion = await faq.getTranslatedQuestion(lang); // Translate the question
    res.json({ question: translatedQuestion, answer: faq.answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new FAQ
router.post('/', async (req, res) => {
  const { question, answer } = req.body;

  const faq = new FAQ({ question, answer });

  try {
    await faq.save(); // Save FAQ to database
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete FAQ by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findByIdAndDelete(id); // Delete FAQ from database
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
