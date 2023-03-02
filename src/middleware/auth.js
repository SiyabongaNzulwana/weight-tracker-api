'use strict'

require('dotenv').config()

const jwt = require('jsonwebtoken')
const config = require('config')

const auth = (req, res, next) => {
  // Ideally I woould get this from the req.header('x-auth-token'),

  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access denied. No token provided.'
      }
    })
  }

  try {
    const decodedPayload = jwt.verify(token, process.env.jwtPrivateKey)
    req.user = decodedPayload
    next()
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid token'
      }
    })
  }
}

module.exports = auth
