const { Server } = require("socket.io");  
const Socket = require('./models/Socket.model.js');
const io = new Server(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("userConnected");
  socket.on("join", async ({ userId }) => {
    let sockets = await Socket.find({ userId }); 
    if (!sockets.includes(socket.id)) { 
      await Socket.updateOne(
        { userId, socketId: socket.id },
        { socketId: socket.id },
        { upsert: true }
      );
    }
  }); 

    //send and get message
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {  
      let sockets = await Socket.find({ userId: receiverId });  
      for (let Socket of sockets) {
        io.to(Socket.socketId).emit("getMessage", {
          receiverId,
          senderId,
          message,
        });
      }
      
    });
});
module.exports = io; 

