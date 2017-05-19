const Mongoose = require('mongoose')

const userSchema = new Mongoose.Schema({
  email: { type: String, index: { unique: true } },
  desiredEmail: { type: String },
  confirmationCode: { type: String },
  confirmDate: { type: Date },
  password: { type: String }
})

module.exports = Mongoose.model('User', userSchema, 'users')
