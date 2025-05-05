const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
require("dotenv").config();

app.use(express.json());

// This endpoint is used to create a new user in the database
app.post("/signup", async (req, res) => {
  const userData = req.body;

  //Creating a new instance of the User model with the received data
  const user = new User(userData);

  try {
    await user.save();
    res.status(201).json({ message: "User data saved successfully" });
  } catch (err) {
    console.error("Error saving user data:", err);
    res.status(400).json({ message: "Error saving user data:" +  err.message });
  }
});

// It uses the email provided in the request body to find the user in the database
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });

    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// This endpoint is used to fetch all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// This endpoint is used to find a user from the database by using the userId provided in the request body
app.get("/findById", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// This endpoint is used to delete a user in the database by using the userId provided in the request body
app.delete("/findByIdAndDelete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// This endpoint is used to update a user in the database by using the userId provided in the request body
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true
    });
    console.log(user);
    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json("User updated successfully");
  } catch (err) {
    res.status(500).send("Something went wrong: " + err.message);
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
