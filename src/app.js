const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");
require("dotenv").config();

app.post("/signup", async (req, res) => {

  const userData = new User({
    firstName: "Rishav",
    lastName: "Kumar",
    email: "rishavkr000@gmail.com",
    password: "Rishav@123",
    age: 24,
    gender: "Male",
  });

  try {
    await userData.save();
    res.status(201).json({ message: "User data saved successfully" });
  } catch (err) {
    console.error("Error saving user data:", err);
    res.status(400).json({ message: "Error saving user data" });
  }
});

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
