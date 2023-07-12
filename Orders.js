const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  name: String,
  price: Number,
  products: Array,
  email: String,
  address: String,
});

module.exports = mongoose.model("orders", OrderSchema);
