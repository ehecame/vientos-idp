const Mongoose = require('mongoose')

const passwordResetSchema = new Mongoose.Schema({
  id: { type: String },
  email: { type: String },
  code: { type: String },
  resetDate: { type: Date }
})

const PasswordReset = Mongoose.model('PasswordReset', passwordResetSchema)

module.exports = PasswordReset
