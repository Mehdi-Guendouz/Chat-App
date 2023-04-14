const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');



dotenv.config()

app.use(cors({
    credentials: true,
    origin: (origin , callback) =>{
        callback(null,origin);
    }
}));

connectDB()
app.listen(process.env.PORT, console.log("server up port: " + process.env.PORT));

