const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/UserModel');


const accessChat = asyncHandler( async (req , res) => {
    const {userId} = req.body

    if(!userId) {
        console.log("User ID not provided")
        return res.sendStatus(404)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users : {$elemMatch: {$eq: userId}}},
            {users : {$elemMatch: {$eq: req.user._id}}},
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        try {
            const createChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password")
            res.status(200).send(fullChat)  
        } catch (error) {
              res.status(404)
            throw new Error(error.message)
        }
    }

})


const fetchAllChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({users: {$elemMatch : {$eq : req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updateAt: -1})
        .then(result => async (result ) => {
            result = await User.populate(result, {
        path: "latestMessage.sender",
        select: "name pic email",
    })
        return res.status(200).send(result)
        })
    } catch (error) {
        res.status(404)
        throw new Error(error.message)
    }
})


const createGroupChat = asyncHandler( async (req , res) => {

    if(!req.body.users || !req.body.name){
        return res.status(404).send({message: 'please fill all the required fields'})
    }

    let users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res.status(404).send({message: 'a group must have at least two users'})
    }
    
    users.push(req.user)

    let chatData = {
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
    }

    try {
        const groupChat = await Chat.create(chatData)
        const fullGroupChat = await Chat.findOne({id: groupChat._id})
        .populate("users", "-password").populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)

    } catch (error) {
        return res.status(404).send({message : error.message})
    }

})

module.exports = {accessChat , fetchAllChats, createGroupChat}