const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// Both are working same
const userDataToPopulate = "firstName lastName gender age profileUrl skills"
// const userDataToPopulate = ["firstName", "lastName", "gender", "age", "profileUrl", "skills"]

// Get all the pending request for the loggegIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", userDataToPopulate)

        if (connectionRequest.length == 0) {
            return res.status(404).json({ message: "No pending request found" })
        }

        return res.json({ message: "Connection found succeccfully", data: connectionRequest })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const findAllConnections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", userDataToPopulate).populate("toUserId", userDataToPopulate)

        if (findAllConnections.length == 0) {
            res.send("Connections not found")
        }

        const data = findAllConnections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({ message: "Connection found", data })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = { userRouter }