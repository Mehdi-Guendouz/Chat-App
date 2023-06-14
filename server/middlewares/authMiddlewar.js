const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const jwt = require("jsonwebtoken");



const protect = asyncHandler( async (req , res , next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_S)
            const user = await User.findById(decode.id).select('-password')
            req.user = user

            next()
        } catch (error) {
            res.status(404)
            throw new Error("not authorized")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("not authorized no token")
    }


})


module.exports = {protect}