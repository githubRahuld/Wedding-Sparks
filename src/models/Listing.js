const mongoose = require("mongoose");
const conn = require("../db/conn");

let listSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    reqired: true,
  },
  email: {
    type: String,
    reqired: true,
  },
  Profession: {
    type: String,
    reqired: true,
  },
  Address: {
    type: String,
    reqired: true,
  },
  contact: {
    type: Number,
    reqired: true,
  },
  rate: {
    type: Number,
    reqired: true,
  },
});

let Listing = new mongoose.model("Listing", listSchema);

module.exports = Listing;
