const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  password: String,
  email: String,
  phone: Number,
  country: String,
  address: String,
  gender: String,
});

module.exports = mongoose.model("User", userSchema);
