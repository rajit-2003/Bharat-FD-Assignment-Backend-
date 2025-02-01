// models/faqModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the FAQ schema with support for 20 languages
const faqSchema = new Schema({
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
    ja: { type: String },
    pt: { type: String },
    ru: { type: String },
    ar: { type: String },
    ko: { type: String },
    it: { type: String },
    tr: { type: String },
    pl: { type: String },
    nl: { type: String },
    sv: { type: String },
    cs: { type: String },
    no: { type: String },
    fi: { type: String },
    da: { type: String },
    el: { type: String }
  }
});

// Method to get translated question dynamically
faqSchema.methods.getTranslatedQuestion = async function(lang) {
  const cacheKey = `translation_${this.question}_${lang}`; // Cache key based on question and language
  return new Promise((resolve, reject) => {
    // Check Redis cache first
    client.get(cacheKey, async (err, cachedTranslation) => {
      if (cachedTranslation) {
        resolve(cachedTranslation);
      } else {
        try {
          // Use Google Translate API if cache is not found
          const { text } = await translate(this.question, { to: lang });
          // Cache the translation for future requests
          client.setex(cacheKey, 86400, text); // Cache expiration time set to 24 hours
          resolve(text);
        } catch (error) {
          // Fallback to original question if translation fails
          resolve(this.question); 
        }
      }
    });
  });
};

// Create FAQ model
const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;

