const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const secretRoomId = ({ userId, targetUserId }) => {
  return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest("hex");
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle event
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = secretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({
      firstName,
      lastName,
      userId,
      targetUserId,
      text,
    }) => {
      // Save message to the database
      try {
        const roomId = secretRoomId(userId, targetUserId);

        // Check the userId and targetUserId are friends
        const checkConnectionValid = await ConnectionRequest.findOne({
          $or: [
            {
              fromUserId: userId,
              toUserId: targetUserId,
              status: "accepted"
            },
            {
              fromUserId: targetUserId,
              toUserId: userId,
              status: "accepted"
            }
          ]
        });

        if (!checkConnectionValid) {
          return res.json({ msg: "You can be only chat with your friends" })
        }

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        })

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            message: []
          })
        }

        chat.messages.push({
          senderId: userId,
          text
        })

        await chat.save();
        io.to(roomId).emit("messageReceived", { firstName, lastName, text })

      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => { });
  });
};

module.exports = initializeSocket;
