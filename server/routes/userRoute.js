const express = require('express')
const { registerUser } = require('../controllers/userControllers')

const router = express.Router()



router.route('/').post(registerUser)


// router.route('/login').post(authUser)


module.exports = router