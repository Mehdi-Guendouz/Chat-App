const express = require('express')
const { protect } = require('../middlewares/authMiddlewar')
const { sendMessage, allMessage } = require('../controllers/messagecontrollers')


const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessage)




module.exports = router