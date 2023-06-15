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
    const result = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
});



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
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).send(fullGroupChat)
        
    } catch (error) {
        return res.status(404).send({message : error.message})
    }

})


const renameGroup = asyncHandler( async (req , res) => {
    const groupId = req.body.groupId
    const groupNewName = req.body.groupName
    const user = req.user

    if(!groupNewName) {
        return res.status(404).send({ message: "you must provide a group name"})
    }
    
    try {
        let group = await Chat.findByIdAndUpdate({_id: groupId, groupAdmin : {$eq : user._id} },{chatName: groupNewName},{new: true})
        .populate("groupAdmin","-password").populate("users","-password")


        res.status(200).send(group)
    } catch (error) {
        res.status(404).send(error.message)
    }


})


const AddToGroup = asyncHandler( async (req , res) => {
    const groupId = req.body.groupId
    const addMember = req.body.addMember

    try {
        let group = await Chat.findByIdAndUpdate({_id: groupId},{$push: {users: addMember}},{new: true})
        .populate("groupAdmin","-password").populate("users","-password")
        res.status(200).send(group)

    } catch (error) {
        res.status(404).send(error.message)
    }
    
})


const removeFromGroup = asyncHandler( async (req , res) => {
    const groupId = req.body.groupId
    const removeMember = req.body.removeMember

    try {
        let group = await Chat.findByIdAndUpdate({_id: groupId},{$pull: {users: removeMember}},{new: true})
        .populate("groupAdmin","-password").populate("users","-password")
        res.status(200).send(group)

    } catch (error) {
        res.status(404).send(error.message)
    }
    
})

module.exports = {accessChat , fetchAllChats, createGroupChat , renameGroup, removeFromGroup, AddToGroup}