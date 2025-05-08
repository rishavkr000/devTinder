const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { signUpValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

// This endpoint is used to create a new user in the database
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const saltRounds = 10;
  try {
    // Validation of user data
    signUpValidation(req);

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Creating a new instance of the User model
    const user = new User({
      firstName, lastName, email, password: hashedPassword
    });

    const existingUser = await User.find({ email: req.body.email });

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    await user.save();
    res.status(201).json({ message: "User data saved successfully" });
  } catch (err) {
    console.error("Error saving user data:", err);
    res.status(400).json({ message: "Error:" + err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all the required fields" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ _id: user._id }, "DevTinder@Rishav", {expiresIn: '7d'})
    // Validate the token
    res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)}); // cookie will be removed after 8 hours

    res.status(200).json({ message: "Login successful", token: token });
  } catch (err) {
    res.status(400).json({ message: "Error:" + err.message });
  }
})

// Get User profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).json({ message: "Error:" + err.message });
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user.firstName + " send a connection request.");
  } catch (err) {
    res.status(400).json({ message: "Error:" + err.message });
  }
})

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(7777, () => {
      console.log("Server is running on the port 7777");
    });
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  });
