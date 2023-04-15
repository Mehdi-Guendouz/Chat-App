const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');



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
