const Mongoose = require('mongoose')

const AuthorizationCodeSchema = new Mongoose.Schema({
  code: String,
  expiresAt: Date,
  grants: [ String ],
  user: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: String
})

module.exports = Mongoose.model('AuthorizationCode', AuthorizationCodeSchema, 'authorizationCodes')
