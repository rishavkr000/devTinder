const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { profileEditFieldValidate, passwordValidation } = require("../utils/validation")
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(500).json({ message: "Error:" + err.message });
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!profileEditFieldValidate(req)) {
            throw new Error("Invalid field to edit")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({ message: `${loggedInUser.firstName}, your profile is update successfully`, data: loggedInUser })

    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        passwordValidation(newPassword);

        const user = req.user

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
        if (!isOldPasswordCorrect) {
            throw new Error("Old Password is incorrect")
        }
        if (oldPassword === newPassword) {
            throw new Error("New Password is not same as the Old Password")
        }
        if (newPassword !== confirmPassword) {
            throw new Error("Confirm Password is must same as the New Password")
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashNewPassword;

        await user.save();
        res.send("Password change successfully")

    } catch (err) {
        res.status(400).send("Error " + err.message)
    }
})


module.exports = { profileRouter }