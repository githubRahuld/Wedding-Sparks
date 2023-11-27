const mongoose = require("mongoose");
const conn = require("../db/conn");

var insertSchema = new mongoose.Schema({
  fname: {
    type: String,
    require: true,
  },
  lname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
  },
  "Booking For": {
    type: String,
  },
});

let Booking = new mongoose.model("Booking", insertSchema, "Booking");
// const Otp = new mongoose.model("Otp",otpSchema);

//export
module.exports = Booking;
