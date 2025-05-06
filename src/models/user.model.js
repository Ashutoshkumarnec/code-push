// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { models } = require("../config/models");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model(models.USER, userSchema);

module.exports = User;
