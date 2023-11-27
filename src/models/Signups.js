const mongoose = require("mongoose");

//creating a schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
});

//define model that is to create collection

const Signup = new mongoose.model("Signup", userSchema);

//export
module.exports = Signup;
