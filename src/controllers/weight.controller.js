'use strict'
const Joi = require('joi')
const { User } = require('../models/user.model')
const { Weight } = require('../models/weight.model')
const fileName = '[weight.controller.js]'

/**
 * This function is responsible for saving a user's weight on the DB.
 */
const addWeight = async (req, res) => {
  const { weightDate, email } = req.body
  try {
    const schema = Joi.object({
      weight: Joi.number().precision(2).required(),
      weightDate: Joi.date().required(),
      email: Joi.string().min(5).max(255).required().email()
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

    if (req.body?.weight <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'weight can not be 0 or less'
        }
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Unknown user.'
        }
      })
    }

    const data = {
      weight: req.body?.weight,
      weightDate,
      userId: user._id
    }

    const weight = await Weight.create(data)

    return res.status(200).json({
      success: true,
      data: weight
    })
  } catch (error) {
    console.log(`Error found on ${fileName} function addWeight(): `, error)
    return res.status(500).json({
      success: false,
      error: error.name
    })
  }
}

/**
 * This function is responsible for retrieving a user's weights documents/records on the DB.
 */
const getUserWeightRecords = async (req, res) => {
  const { email } = req.params
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'email address is required.'
        }
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Unknown user.'
        }
      })
    }

    const data = await Weight.find({ userId: user._id })

    const sortedData = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    return res.status(200).json({
      success: true,
      data: sortedData
    })
  } catch (error) {
    console.log(`Error found on ${fileName} function getUserWeights(): `, error)
    return res.status(500).json({
      success: false,
      error: error.name
    })
  }
}

/**
 * This function is responsible for removing a user's weights document/record on the DB.
 */
const removeUserWeightRecord = async (req, res) => {
  const { id } = req.params
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No weight id has been specified.'
        }
      })
    }

    const data = await Weight.findOneAndDelete({ _id: id })

    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(400).json({
        success: false,
        error: {
          message: 'The weight to delete was not found.'
        }
      })
    }
  } catch (error) {
    console.log(
      `Error found on ${fileName} function removeUserWeightRecord(): `,
      error
    )
    return res.status(500).json({
      success: false,
      error: error.name
    })
  }
}

/**
 * This function is responsible for updating a user's weights document/record on the DB.
 */
const updateUserWeightRecord = async (req, res) => {
  const { id } = req.params
  const { weight, weightDate } = req.body
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No weight id has been specified.'
        }
      })
    }

    const weightToUpdate = await Weight.findById({ _id: id })

    if (!weightToUpdate) {
      return res.status(400).json({
        success: false,
        error: {
          message: `No weight found with the ID ${id}.`
        }
      })
    }

    const filter = { _id: id }

    const update = {
      weight: weight ? weight : weightToUpdate.weight,
      weightDate: weightDate ? weightDate : weightToUpdate.weightDate
    }

    const updatedWeight = await Weight.findOneAndUpdate(filter, update, {
      new: true
    })

    return res.status(200).json({
      success: true,
      data: updatedWeight
    })
  } catch (error) {
    console.log(
      `Error found on ${fileName} function updateUserWeightRecord(): `,
      error
    )
    return res.status(500).json({
      success: false,
      error: error.name
    })
  }
}

module.exports = {
  addWeight,
  getUserWeightRecords,
  removeUserWeightRecord,
  updateUserWeightRecord
}
