// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferredLanguage: { type: String, enum: ['en', 'hi', 'bn', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'ru', 'ar', 'ko', 'it', 'tr', 'pl', 'nl', 'sv', 'cs', 'no', 'fi', 'da', 'el'], default: 'en' }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
