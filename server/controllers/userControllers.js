const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const generateToken = require('../config/generateToken');


const registerUser = asyncHandler ( async (req ,res) => {
    const {name , email , password, pic} = req.body

    if( !name || !email || !password){
        res.status(404);
        throw new Error("please Enter all the required fields")
    }

    const userExists = await User.findOne({ email });

    if( userExists ){
        res.status(404);
        throw new Error("User already exists")
    }

    const user = await User.create({ name , email , password, pic})

    if ( user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        throw new Error("failed to create user")
    }

})



const authUser = asyncHandler(async (req, res) => {

    const { email , password } = req.body

    if( !email || !password ){
        throw new Error("Please fill in the required fields")
    }

    const user = await User.findOne({ email });

    if( user && (await user.matchPassword(password)) ){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }



})


const allUsers = asyncHandler( async (req, res) => {
    const keywords = req.query.search ? {
        $or: [ 
                {name : {$regex: req.query.search, $options: "i"}},
                {email : {$regex: req.query.search, $options: "i"}} 
            ]
    } : {}
    
    const users = await User.find(keywords)
    res.send(users)
})


module.exports = { registerUser , authUser , allUsers}