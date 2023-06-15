const express = require('express')
const { protect } = require('../middlewares/authMiddlewar')
const {accessChat, fetchAllChats, createGroupChat, renameGroup, removeFromGroup, AddToGroup} = require('../controllers/chatcontrollers')


const router = express.Router()


router.route('/').post(protect , accessChat).get(protect, fetchAllChats)
router.route('/group').post(protect , createGroupChat)
router.route('/rename').put(protect , renameGroup)
router.route('/groupRemove').put(protect , removeFromGroup)
router.route('/groupadd').put(protect , AddToGroup)

module.exports = router