const express = require('express');
const FAQ = require('../models/faqModel');  // FAQ model for CRUD operations
const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();  // Retrieve all FAQs from the database
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get FAQ by ID with language support
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';  // Default to English if no language provided

  try {
    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    // Translate the question to the requested language
    const translatedQuestion = await faq.getTranslatedQuestion(lang);
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
    await faq.save();  // Save the FAQ to the database
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete FAQ by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findByIdAndDelete(id);  // Delete FAQ from the database
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

