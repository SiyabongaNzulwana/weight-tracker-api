const express = require('express')
const userController = require('../controllers/user.controller')
const auth = require('../middleware/auth')
const { User } = require('../models/user.model')
const router = express.Router()

router.post('/sign_up', userController.registerUser)
router.post('/login', auth, userController.signIn)

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  return res.status(200).json({
    success: true,
    data: user
  })
})

module.exports = router
