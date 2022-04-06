const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = 5000;
const url = "mongodb://localhost:27017/chat"
const userRoutes = require('./routes/userRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const socket = require('socket.io')
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json())
app.use("/api/auth/", userRoutes);
app.use("/api/messages", messageRoutes)
mongoose
.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Db connection established.");
})
.catch((err)=>{
    console.log(err.message);
})

const server = app.listen(port, ()=>{
    console.log(`server started on Port http://localhost:${port}`);
})
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        Credentials: true,
    }
});
global.onlineUsers = new Map();
io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recive", data.msg);
        }
    })
})