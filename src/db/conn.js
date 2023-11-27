const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/Signup")
  .then(() => {
    console.log("connection established!");
  })
  .catch((e) => {
    console.log(e);
  });
