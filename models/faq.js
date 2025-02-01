// models/faqModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const redis = require('redis');
const client = redis.createClient();
const { translate } = require('@vitalets/google-translate-api');

// FAQ schema with multiple language fields
const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    en: { type: String }, // English
    hi: { type: String }, // Hindi
    bn: { type: String }, // Bengali
    es: { type: String }, // Spanish
    fr: { type: String }, // French
    de: { type: String }, // German
    zh: { type: String }, // Chinese (Simplified)
    ru: { type: String }, // Russian
    ar: { type: String }, // Arabic
    pt: { type: String }, // Portuguese
    it: { type: String }, // Italian
    ja: { type: String }, // Japanese
    ko: { type: String }, // Korean
    tr: { type: String }, // Turkish
    pl: { type: String }, // Polish
    sv: { type: String }, // Swedish
    no: { type: String }, // Norwegian
    nl: { type: String }, // Dutch
    da: { type: String }, // Danish
    fi: { type: String }, // Finnish
    he: { type: String }, // Hebrew
    th: { type: String }, // Thai
    vi: { type: String }, // Vietnamese
  },
});

// Method to get translated question
faqSchema.methods.getTranslatedQuestion = async function (lang) {
  const cacheKey = `translation_${this.question}_${lang}`;
  return new Promise((resolve, reject) => {
    client.get(cacheKey, async (err, cachedTranslation) => {
      if (cachedTranslation) {
        resolve(cachedTranslation);
      } else {
        try {
          const { text } = await translate(this.question, { to: lang });
          client.setex(cacheKey, 86400, text); // Cache translation for 1 day
          resolve(text);
        } catch (error) {
          resolve(this.question); // Fallback to original question if translation fails
        }
      }
    });
  });
};

module.exports = mongoose.model('FAQ', faqSchema);

