const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).send(user.firstName + " send a connection request.");
    } catch (err) {
        res.status(400).json({ message: "Error:" + err.message });
    }
})

module.exports = { requestRouter }