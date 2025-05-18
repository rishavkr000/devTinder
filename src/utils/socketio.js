const socket = require("socket.io");
const crypto = require("crypto");

const secretRoomId = ({userId, targetUserId}) => {
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

      console.log(firstName + " is joining : " + roomId)
      socket.join(roomId);
    });

    socket.on("sendMessage", ({
      firstName,
      userId,
      targetUserId,
      text,
    }) => {
      const roomId = secretRoomId(userId, targetUserId);
      console.log(firstName + " : " + text);
      io.to(roomId).emit("messageReceived", { firstName, text })
    });

    socket.on("disconnect", () => { });
  });
};

module.exports = initializeSocket;
