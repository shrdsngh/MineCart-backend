const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Products = require("./product");
const Orders = require("./Orders");
const stripe = require("stripe")(
  "sk_test_51NMml8SG0P2qUZ5rVOR4kwAwlOF6TC8UsmlGxBhagsEBVAtBsfuHAGUzSGzWFIm4RAOkOd27sLsT2OyDQ6erXLY300WcXdc8w8"
);

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://shrdsngh:kqOMyXaLBTqT9MGu@cluster0.jwe7xcs.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("failed");
  });

app.get("/", (req, res) => res.status(200).send("Hello World"));

app.post("/products/add", (req, res) => {
  const productDetail = req.body;
  console.log("Product Detail>>>", productDetail);
  Products.create(productDetail);
});

app.get("/products/get", (req, res) => {
  Products.find().then((data, err) => {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send(err.message);
    }
  });
});

//API for payment
app.post("/payment/create", async (req, res) => {
  const total = req.body.amount;
  console.log("Payment Request received for this amount: $", total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "usd",
  });

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});

//API to add order details

app.post("/orders/add", (req, res) => {
  const products = req.body.basket;
  const price = req.body.price;
  const email = req.body.email;
  const address = req.body.address;

  const orderDetails = {
    products: products,
    price: price,
    address: address,
    email: email,
  };

  Orders.create(orderDetails).then((result, err) => {
    console.log("Order saved to database >>", result);
  });
});

app.post("/orders/get", (req, res) => {
  Orders.find({}).then((result) => {
    if (result) {
      res.send(result);
    }
  });
});

app.listen(port, () => console.log("listening on port: ", port));
