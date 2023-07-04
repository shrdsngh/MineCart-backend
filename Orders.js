const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  price: Number,
  products: Array,
  email: String,
});

module.exports = mongoose.model("orders", OrderSchema);
