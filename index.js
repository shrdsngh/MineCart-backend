const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Products = require("./product");
const Orders = require("./Orders");
const User = require("./DB/User");
const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";
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

app.post("/register", async (req, res) => {
  const { email, password, name, id, phone, country, address, gender } =
    req.body;

  const userDetail = {
    id: id,
    email: email,
    password: password,
    name: name,
    phone: phone,
    country: country,
    address: address,
    gender: gender,
  };

  const user_exist = await User.findOne({ email: email });

  if (user_exist) {
    res.send({ message: "The Email is already in use !" });
  } else {
    User.create(userDetail).then((err, result) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.send({ message: "User Created Succesfully" });
      }
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await User.findOne({ email: email });

  if (userDetail) {
    if (password === userDetail.password) {
      Jwt.sign({ userDetail }, jwtKey, { expiresIn: 60 * 60 }, (err, token) => {
        if (err) {
          res.send("some error");
        }
        res.send({ userDetail, auth: token });
      });
    } else {
      res.send({ error: "invaild Password" });
    }
  } else {
    res.send({ error: "user does not exist" });
  }
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
  const email = req.body.address.email;
  const address = req.body.address.address;
  const name = req.body.name;

  const orderDetails = {
    name: name,
    products: products,
    price: price,
    address: address,
    email: email,
  };

  Orders.create(orderDetails).then((result, err) => {
    if (result) {
      console.log("order added to database>>", result);
    } else {
      console.log(err);
    }
  });
});

app.post("/orders/get", (req, res) => {
  const email = req.body.email;

  Orders.find({}).then((result) => {
    if (result) {
      const userOrders = result.filter((order) => order.email === email);
      res.send(userOrders);
    } else {
      res.send("no orders found");
    }
  });
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.warn("middleware called ", token);
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.send({ result: "Please provide valid token " });
      } else {
        next();
      }
    });
  } else {
    res.send({ result: "Please add token with header" });
  }
}

app.listen(port, () => console.log("listening on port: ", port));
