const Mongoose = require('mongoose')

const userSchema = new Mongoose.Schema({
  id: { type: String },
  email: { type: String, index: { unique: true } },
  desiredEmail: { type: String },
  confirmationCode: { type: String },
  confirmDate: { type: Date },
  password: { type: String }
})

const User = Mongoose.model('User', userSchema)
module.exports = User
