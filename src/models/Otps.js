const mongoose = require("mongoose");
const conn = require("../db/conn");
var otpSchema = new mongoose.Schema(
  {
    email: String,
    code: String,
    expireIn: Number,
  },
  {
    timestamps: true,
  }
);

let Otp = new mongoose.model("otp", otpSchema, "otp");
// const Otp = new mongoose.model("Otp",otpSchema);

//export
module.exports = Otp;
