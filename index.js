const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require('express-session');
const authRouter = require("./routes/auth");
const secureRoute = require("./routes/secureRoute");
const userSaveRoute = require("./routes/userSaveRoute");
const passport = require("./config/passport-setup");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: 'love-cat',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/secure", secureRoute);
app.use("/api", userSaveRoute);
