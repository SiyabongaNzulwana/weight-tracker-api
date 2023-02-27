const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 3, maxlength: 50 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    email: { type: String, required: true, unique: true },
    dateJoined: { type: Date, default: Date.now, required: true },
    password: { type: String }
  },
  {
    timestamps: true,
    collection: 'user'
  }
)

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
  return token
}

const User = mongoose.model('User', userSchema)

exports.User = User
