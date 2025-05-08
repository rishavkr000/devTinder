const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            throw new Error("Token is required, Please login first!");
        }

        const tokenVerification = await jwt.verify(token, "DevTinder@Rishav");

        const { _id } = tokenVerification;

        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { userAuth }