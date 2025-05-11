const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"]
        const isStatusValid = allowedStatus.includes(status);
        if (!isStatusValid) {
            return res.status(400).json({
                success: false,
                message: `Invalid status '${status}'. Allowed values: ${allowedStatus.join(", ")}.`
            });
        }

        const targetUser = await User.findById(toUserId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "The user you are trying to connect with does not exist."
            });
        }

        // We do this validation at schema level using 'Pre middleware'
        // if (fromUserId.equals(toUserId)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "You cannot send a connection request to yourself."
        //     });
        // }

        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: "A connection between you and this user already exists."
            });
        }

        const connection = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const savedConnection = await connection.save();

        const name = `${req.user.firstName}`;
        const dynamicMessage =
            status === "interested"
                ? `${name} is interested in your profile.`
                : `${name} has ignored your profile.`;

        return res.status(200).json({
            success: true,
            message: dynamicMessage,
            data: savedConnection
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending the connection request.",
            error: err.message
        });
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params

        const allowedStatus = ["rejected", "accepted"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(404).json({message: "Connection request not found"})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message: "Connection request " + status, data})
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending the connection request.",
            error: err.message
        });
    }
})

module.exports = { requestRouter }