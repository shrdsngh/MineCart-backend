const mongoose = require("mongoose");

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
