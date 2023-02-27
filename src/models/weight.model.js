const mongoose = require('mongoose')

const weightSchema = new mongoose.Schema(
  {
    weight: { type: Number, required: true },
    weightDate: { type: Date, required: true },
    userId: { type: mongoose.ObjectId, required: true }
  },
  {
    timestamps: true,
    collection: 'weight'
  }
)

const Weight = mongoose.model('Weight', weightSchema)

exports.Weight = Weight
