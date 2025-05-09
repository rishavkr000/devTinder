const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { signUpValidation } = require("../utils/validation")

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) }); // cookie will be removed after 8 hours
            res.status(200).json({ message: "Login successful", token: token });
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }
})


module.exports = { authRouter }