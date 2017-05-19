const Mongoose = require('mongoose')

const passwordResetSchema = new Mongoose.Schema({
  email: { type: String },
  code: { type: String },
  resetDate: { type: Date }
})

module.exports = Mongoose.model('PasswordReset', passwordResetSchema, 'passwordResets')
