// models/faq.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// FAQ Schema to handle questions, answers, and language-specific translations
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
        ru: { type: String },
        pt: { type: String },
        ja: { type: String },
        ar: { type: String },
        it: { type: String },
        tr: { type: String },
        ko: { type: String },
        pl: { type: String },
        ro: { type: String },
        nl: { type: String },
        sv: { type: String },
        no: { type: String },
        da: { type: String }
    }
});

// Model method to get translated questions dynamically
faqSchema.methods.getTranslatedQuestion = async function (lang) {
    const cacheKey = `translation_${this.question}_${lang}`;
    return new Promise((resolve, reject) => {
        // Use Redis cache to check if the translation exists
        client.get(cacheKey, async (err, cachedTranslation) => {
            if (cachedTranslation) {
                resolve(cachedTranslation);
            } else {
                try {
                    const { text } = await translate(this.question, { to: lang });
                    client.setex(cacheKey, 86400, text); // Cache translation for 24 hours
                    resolve(text);
                } catch (error) {
                    resolve(this.question); // Return original question if translation fails
                }
            }
        });
    });
};

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;

