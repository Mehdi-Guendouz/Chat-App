const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

dotenv.config()

app.use(cors({
    credentials: true,
    origin: (origin , callback) =>{
        callback(null,origin);
    }
}));

app.listen(process.env.PORT, console.log("server up port: " + process.env.PORT));

