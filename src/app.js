const express = require("express");
const hbs = require("hbs");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");
// console.log("Generated secret key:", secretKey);
const app = express();

require("./db/conn");
const Signup = require("./models/Signups");
const Otp = require("./models/Otps");
const Booking = require("./models/Bookings");
const Listing = require("./models/Listing");
const { response } = require("express");
const { log } = require("console");
const VendorSignup = require("./models/VendorSignup");

const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//to get user data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
// Initialize session middleware
app.use(
  session({
    secret: secretKey, // Change this to a secure random key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("view engine", "ejs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("Login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/Vendor_Login", (req, res) => {
  res.render("Vendor_Login");
});
app.get("/Signup", (req, res) => {
  res.render("Signup");
});
app.get("/Vendor_Signup", (req, res) => {
  res.render("Vendor_Signup");
});
app.get("/ForgotPass", (req, res) => {
  res.render("ForgotPass");
});
app.get("/Booking", (req, res) => {
  res.render("Booking");
});
app.get("/Home", (req, res) => {
  const email = req.session.email;
  res.render("Home", { email });
});
app.get("/Home_vendor", (req, res) => {
  const email = req.session.email;
  res.render("Home_vendor", { email });
});
app.get("/confirmOtpV", (req, res) => {
  const email = req.session.email;
  res.render("confirmOtpV", { email });
});
app.get("/confirmOtp", (req, res) => {
  const email = req.session.email;
  res.render("confirmOtp", { email });
});
app.get("/ListingPage_Vendor", (req, res) => {
  res.render("ListingPage_Vendor");
});
app.get("/otpsend", (req, res) => {
  const email = req.session.email;
  res.render("otpsend", { email });
});
app.get("/otpsendV", (req, res) => {
  const email = req.session.email;
  res.render("otpsendV", { email });
});
// app.get("/dashboard", (req, res) => {
//   const email = req.session.email;
//   res.render("dashboard", { email });
// });
app.post("/Home_vendor", (req, res) => {
  const email = req.body.email;
  res.render("Home_vendor");
});

//create a new user in our database
// normal Signup
app.post("/Signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    console.log(req.body.email);
    console.log(password);
    if (password === cpassword) {
      console.log("Pass matched");

      const userRegister = new Signup({
        email: req.body.email,
        password: password,
        cpassword: cpassword,
      });

      const registered = await userRegister.save();
      res.status(201).render("Login");
    } else {
      console.log("Password Not Matching!");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// vendor Signup
app.post("/Vendor_Signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    console.log(req.body.email);
    console.log(password);
    if (password === cpassword) {
      console.log("Pass matched");

      const vendorRegister = new VendorSignup({
        email: req.body.email,
        password: password,
        cpassword: cpassword,
      });

      const registered = await vendorRegister.save();
      res.status(201).render("Vendor_Signup");
    } else {
      console.log("Password Not Matching!");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//login check
app.post("/Login", async (req, res) => {
  try {
    const email = req.body.email;

    const password = req.body.password;

    console.log(`${email} and ${password}`);

    // userEmail contail all the data of user like email and pass
    const userEmail = await Signup.findOne({ email: email });
    // res.send(userEmail );

    if (userEmail.password === password) {
      res.status(201).render("otpsend");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (error) {
    res.status(400).send("Invalid Mail");
  }
});

// vendor login check
app.post("/Vendor_Login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log(`${email} and ${password}`);

    // userEmail contail all the data of user like email and pass
    const userEmail = await VendorSignup.findOne({ email: email });
    // res.send(userEmail );

    if (userEmail.password === password) {
      res.status(201).render("otpsendV");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (error) {
    res.status(400).send("Invalid Mail");
  }
});

//send otp
const mailer = (email, Otp) => {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rahuldhakad201.rd@gmail.com",
      pass: "rtss jkfh ciqt nwzz",
    },
  });

  var mailOptions = {
    from: "201b205@juetguna.in",
    to: email,
    subject: "OTP for your Wedding Spark Login :)",
    text: `Your OTP is:  ${Otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

app.post("/otpsend", async (req, res) => {
  try {
    const email = req.body.email;
    // console.log(email);

    // Store the email in the session
    req.session.email = email;

    const data = await Signup.findOne({ email: email });
    const responseType = {};
    if (data) {
      let otpCode = Math.floor(Math.random() * 10000 + 1);
      console.log(`OTP is :${otpCode}`);

      const otpData = new Otp({
        //to save otp in database
        email: email,
        code: otpCode,
        expireIn: new Date().getTime() + 60 * 1000, //otp expire in 2 min
      });

      const otpResponse = await otpData.save();
      console.log(otpResponse);
      responseType.statusText = "Sucess";

      mailer(email, otpCode);

      responseType.message = "Please check your email Id";
      console.log(responseType.message);

      res.status(201).render("confirmOtp", { email });
    } else {
      responseType.statusText = "Error";
      responseType.message = "Email Id not Exits";
    }
  } catch (error) {
    res.status(404).send("Something went wrong with mail");
  }
});

// vendor

app.post("/otpsendV", async (req, res) => {
  try {
    const email = req.body.email;

    // Store the email in the session
    req.session.email = email;
    // console.log(email);

    const data = await VendorSignup.findOne({ email: email });
    const responseType = {};
    if (data) {
      let otpCode = Math.floor(Math.random() * 10000 + 1);
      console.log(`OTP is :${otpCode}`);

      const otpData = new Otp({
        //to save otp in database
        email: email,
        code: otpCode,
        expireIn: new Date().getTime() + 60 * 1000, //otp expire in 2 min
      });

      const otpResponse = await otpData.save();
      console.log(otpResponse);
      responseType.statusText = "Sucess";

      mailer(email, otpCode);

      responseType.message = "Please check your email Id";
      console.log(responseType.message);

      res.status(201).render("confirmOtpV", { email });
    } else {
      responseType.statusText = "Error";
      responseType.message = "Email Id not Exits";
    }
  } catch (error) {
    res.status(404).send("Something went wrong with mail");
  }
});

//confirm otp
app.post("/confirmOtp", async (req, res) => {
  const email = req.session.email;
  try {
    console.log("After otp send");
    const OTP = req.body.otp;

    console.log(`you typed : ${OTP}`);

    let otpData = await Otp.findOne({ code: OTP });

    // console.log(otpData.code);
    if (otpData.code === OTP) {
      //for otp expire
      // let currentTime = new Date().getTime();
      // console.log(currentTime);
      // let diff = otpData.expireIn - currentTime;
      // if (diff < 0) {
      //   res.send("OTP expire");
      // } else {
      // }
      res.status(201).render("Home", { email });
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    res.status(404).send("error with OTP");
  }
});

// vendor

//confirm otp
app.post("/confirmOtpV", async (req, res) => {
  const email = req.session.email;
  console.log(email);
  try {
    console.log("After otp send");
    const OTP = req.body.otp;
    console.log(`you typed : ${OTP}`);

    let otpData = await Otp.findOne({ code: OTP });

    // console.log(otpData.code);
    if (otpData.code === OTP) {
      //for otp expire
      let currentTime = new Date().getTime();
      console.log(currentTime);
      //   let diff = otpData.expireIn - currentTime;
      //   if (diff < 0) {
      //     res.send("OTP expire");
      //   } else {

      //   }
      res.render("Home_vendor", { email });
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    res.status(404).send("error with OTP");
  }
});

//book appointment | insert user details
app.post("/Booking", async (req, res) => {
  const responseType = {};
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  let date = req.body.date;
  //   date = date.toLocaleTimeString();
  console.log(date.toLocaleString());
  //   const time = req.body.time;

  try {
    const userData = new Booking({
      fname: fname,
      lname: lname,
      email: email,
      date: date,
      //   time: time,
      //   Date: new Date().toLocaleTimeString(),
    });

    const userDetails = await userData.save();
    console.log(userDetails);
    responseType.statusText = "Sucess";

    res.status(201).render("home");
  } catch (error) {
    res.status(404).send("something went wrong");
    console.log(error);
  }
});

app.get("/index", function (req, res) {
  res.render("index", { details: null });
});

// Dashboard
app.get("/dashboard", function (req, res) {
  const email = req.session.email;
  console.log(`my email: ${email}`);
  Booking.find({}, function (err, allDetails) {
    console.log(typeof allDetails);

    const currPerson = allDetails.filter((obj) => {
      console.log(obj.email);
      return obj.email == email;
    });
    if (currPerson.length > 0) console.log(currPerson);
    else console.log("value not found");

    if (err) {
      console.log(err);
    } else {
      // res.render("dashboard", { details: currPerson });
      res.render("dashboard", { details: currPerson, email });
      // console.log(details);
    }
  });
});

// Vendor Dashboard
app.get("/vendor_dashboard", function (req, res) {
  const email = req.session.email;
  console.log(email);
  console.log(`my email: ${email}`);
  Listing.find({}, function (err, allDetails) {
    console.log(typeof allDetails);

    const currPerson = allDetails.filter((obj) => {
      console.log(obj.email);
      return obj.email == email;
    });
    if (currPerson.length > 0) console.log(currPerson);
    else console.log("value not found");

    if (err) {
      console.log(err);
    } else {
      // res.render("dashboard", { details: currPerson });
      res.render("vendor_dashboard", { details: currPerson, email });
      // console.log(details);
    }
  });
});

// Listing Page
app.post("/ListingPage_vendor", async (req, res) => {
  const { fname, lname, Address, email, Profession, contact, rate } = req.body;

  try {
    const listData = new Listing({
      fname: fname,
      lname: lname,
      email: email,
      Address: Address,
      Profession: Profession,
      contact: contact,
      rate: rate,
    });
    const vendorData = await listData.save();
    console.log(vendorData);

    res.status(201).render("Home_vendor");
  } catch (error) {
    res.status(404).send("something went wrong");
    console.log(`error: ${error}`);
  }
});

// search Page
// Dashboard
app.get("/SearchPage", function (req, res) {
  Listing.find({}, function (err, allDetails) {
    console.log(typeof allDetails);

    if (err) {
      console.log(err);
    } else {
      res.render("SearchPage", { details: allDetails });
      // console.log(details);
    }
  });
});

app.listen(port, () => {
  console.log(`listening to the port: ${port}`);
});
