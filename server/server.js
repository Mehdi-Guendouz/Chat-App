const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const { notfoundHandler, errorHandler } = require('./middlewares/errorMiddleware');



dotenv.config()
app.use(express.json())

app.use(cors({
    credentials: true,
    origin: (origin , callback) =>{
        callback(null,origin);
    }
}));

connectDB()
app.listen(process.env.PORT, console.log("server up port: " + process.env.PORT));

app.use("/api/user", userRoute)

app.use(notfoundHandler)
app.use(errorHandler)
