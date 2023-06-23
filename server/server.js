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
app.listen(process.env.PORT, console.log("server up port: " + process.env.PORT));

app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)

app.use(notfoundHandler)
app.use(errorHandler)