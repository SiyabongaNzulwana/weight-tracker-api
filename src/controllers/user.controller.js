'use strict'

const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../models/user.model')
const fileName = '[user.controller.js]'

/**
 * This function is responsible to register or signUp a new user on the application.
 */
const registerUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(30).required(),
      lastName: Joi.string().min(3).max(30).required(),
      gender: Joi.string().valid('male', 'female', 'other'),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.message
        }
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      const hash = bcrypt.hashSync(password, 10)
      req.body.password = hash
      User.create(req.body).then((user) => {
        user.password = undefined
        const token = user.generateAuthToken()

        const userObject = user.toObject()
        Object.assign(userObject, { token })

        return res.header('x-auth-token', token).status(200).json({
          success: true,
          data: userObject
        })
      })
    } else {
      return res.status(400).json({
        success: false,
        error: {
          message: 'The user already exists.'
        }
      })
    }
  } catch (error) {
    console.log(`Error found on ${fileName} function registerUser(): `, error)
    return res.status(500).json({
      success: false,
      error: error.name
    })
  }
}

/**
 * This function is responsible for signing in users of the application.
 */
const signIn = async (req, res) => {
  const { email, password } = req.body

  try {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().required()
    })
    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.message
        }
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Something went wrong...'
        }
      })
    }

    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid email or password.'
        }
      })
    }

    const token = user.generateAuthToken()
    const userObject = user.toObject()
    Object.assign(userObject, { token })
    return res.header('x-auth-token', token).status(200).json({
      success: true,
      data: userObject,
      message: 'Successfully LoggedIn...'
    })
  } catch (error) {
    console.log(`Error found on ${fileName} function signIn(): `, error)
    return res.status(500).json({
      success: false,
      error: error.name
    })
  }
}

module.exports = { registerUser, signIn }
