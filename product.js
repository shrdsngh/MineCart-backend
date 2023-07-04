const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  title: String,
  url: String,
  price: Number,
  vendor: String,
  rating: Number,
});

module.exports = mongoose.model("products", ProductSchema);
