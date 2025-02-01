// controllers/faqController.js

const FAQ = require('../models/faqModel');
const { translate } = require('@vitalets/google-translate-api');
const redis = require('redis');
const client = redis.createClient();

// Create new FAQ
exports.createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = new FAQ({ question, answer });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all FAQs with translations
exports.getFAQs = async (req, res) => {
  const lang = req.query.lang || 'en'; // Default language is English

  try {
    const faqs = await FAQ.find();
    const translatedFAQs = await Promise.all(
      faqs.map(async (faq) => {
        // Dynamically fetch translation for the selected language
        const translatedQuestion = await faq.getTranslatedQuestion(lang);
        return {
          question: translatedQuestion,
          answer: faq.answer,
        };
      })
    );
    res.json(translatedFAQs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

