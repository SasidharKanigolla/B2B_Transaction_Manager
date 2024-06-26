if (process.env.NODE_ENV != "production") {
  //We are not going to use the .env file in the production because it contains confidential data
  require("dotenv").config(); //dotenv is an extension used for retriving the data from .env file without using the file
}

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User.js");

const ExpressError = require("./utils/ExpressError");

const customerRouter = require("./routes/customer");
const supplierRouter = require("./routes/supplier.js");
const stockRouter = require("./routes/stock.js");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");

const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
const cookieParser = require("cookie-parser");

const mongourl = "mongodb://localhost:27017/allTransaction";
const dburl = process.env.ATLASDB_URL;
// console.log(dburl);

app.use(
  cors({
    origin: [
      "https://b2b-transaction-manager.netlify.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());
app.use(cookieParser());

const sessionOptions = {
  secret: "sdvhbsfhvbfsjveirjbghetbGDGD", //secret must be long, But now we are using this temporarily
  resave: false, //It forces to resave the data whether it is changed or not
  saveUninitialized: true, //Used to save the uninitialized data
  //session contains cookie
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //The cookie will expire in today + 7days
    maxAge: 7 * 24 * 60 * 60 * 1000, //Same as expire
    httpOnly: true, //default value
  },
};

app.use(session(sessionOptions));

// app.use(passport.initialize()); //For initializing the passport
// app.use(passport.session()); //passport must use session for authentication in all pages of the website
// passport.use(new LocalStrategy(User.authenticate())); //passport uses LocalStrategy method to authenticate the user
// // Searialized and desearialized user are used for authentication
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("connection to DB is successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.use("/", userRouter);
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/stock", stockRouter);
app.use("/order", orderRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); //The pages other than mentioned above requests occur we can pass it as a error 404 with message Page Not Found
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!!" } = err;
  // console.error(err.stack);
  res.status(statusCode).json({ error: err.stack });
});

app.listen(8080, () => console.log("App is listening"));
