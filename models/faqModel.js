const mongoose = require('mongoose');
const translate = require('@vitalets/google-translate-api');  // Google Translate API

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    en: { type: String },
    hi: { type: String },
    bn: { type: String },
    es: { type: String },
    fr: { type: String },
    de: { type: String },
    zh: { type: String },
    // Add more languages as needed
  }
});

// Method to retrieve translated question
faqSchema.methods.getTranslatedQuestion = async function (lang) {
  if (this.translations[lang]) {
    return this.translations[lang];  // Return cached translation if available
  } else {
    try {
      // If translation is not available, fetch it using Google Translate API
      const translated = await translate(this.question, { to: lang });
      this.translations[lang] = translated.text;
      await this.save();  // Save translated question in database
      return translated.text;
    } catch (error) {
      return this.question;  // Fallback to the original question if translation fails
    }
  }
};

module.exports = mongoose.model('FAQ', faqSchema);
