const express = require("express");
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const user = req.user;
        const userId = user._id;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        })

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
            await chat.save();
        }
        res.json(chat);

    } catch (err) {
        console.log(err)
    }
})

module.exports = { chatRouter };