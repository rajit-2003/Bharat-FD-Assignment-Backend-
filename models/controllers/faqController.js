// controllers/faqController.js
const FAQ = require('../models/faq');
const { translate } = require('@vitalets/google-translate-api');

// Get all FAQs
const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs" });
    }
};

// Get a specific FAQ with translation support
const getFAQById = async (req, res) => {
    const { id } = req.params;
    const lang = req.query.lang || 'en'; // Default to English if no lang parameter is provided

    try {
        const faq = await FAQ.findById(id);
        if (!faq) return res.status(404).json({ message: "FAQ not found" });

        const translatedQuestion = await faq.getTranslatedQuestion(lang);
        res.status(200).json({
            question: translatedQuestion,
            answer: faq.answer
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQ" });
    }
};

// Create a new FAQ
const createFAQ = async (req, res) => {
    const { question, answer } = req.body;
    try {
        const newFAQ = new FAQ({ question, answer });
        await newFAQ.save();
        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(400).json({ message: "Error creating FAQ" });
    }
};

// Delete a FAQ
const deleteFAQ = async (req, res) => {
    const { id } = req.params;
    try {
        const faq = await FAQ.findByIdAndDelete(id);
        if (!faq) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ" });
    }
};

module.exports = {
    getFAQs,
    getFAQById,
    createFAQ,
    deleteFAQ
};
