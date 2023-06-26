const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const chatRoute = require("./routes/chatRoutes")
const userRoute = require('./routes/userRoute');
const messageRoute = require('./routes/messageRoute');
const { notfoundHandler, errorHandler } = require('./middlewares/errorMiddleware');


dotenv.config()
app.use(express.json())

app.use(cors({
    origin: "*",
}))


connectDB()

app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)

app.use(notfoundHandler)
app.use(errorHandler)

const server = app.listen(process.env.PORT, console.log("server up port: " + process.env.PORT));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("connection established socket io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected")
    })

    socket.on("typing", (chat) => {
        if(!chat.users) return;
        socket.in(chat._id).emit("someone typing");
    })

    socket.on("notTyping", (chat) => {
        if(!chat.users) return;
        socket.in(chat._id).emit("stop typing");
    })

    socket.on("join chat", (room) => {
        socket.join(room._id);
        // console.log("user joined room " ,room._id);
        socket.emit("joined");
    })

    socket.on("new message", (message) => {
        let chat = message.chat
        if(!chat.users ) return console.log("no users");

        chat.users.forEach(user => {
            if(user._id === message.sender._id) return 

            socket.in(user._id).emit("message received", message);

        })

    })
})
