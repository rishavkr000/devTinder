const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Both are working same
const userDataToPopulate = "firstName lastName gender age profileUrl skills about"
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
            return res.status(200).json({ message: "No pending request found" })
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
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({ message: "Connection found", data })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // User should see all the user card except
        // 1. his own card
        // 2. his connection
        // 3. ignored people
        // 4. already sent the connection request 

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser },
                { toUserId: loggedInUser._id }
            ]
        })

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(userDataToPopulate).skip(skip).limit(limit);

        res.send(users)

    } catch (err) {
        res.status(400).json({ Error: + err.message })
    }
})

module.exports = { userRouter }