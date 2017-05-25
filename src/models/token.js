const Mongoose = require('mongoose')

const tokenSchema = new Mongoose.Schema({
  accessToken: String,
  expiresAt: Date,
  user: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: String, ref: 'Client' }
})

module.exports = Mongoose.model('Token', tokenSchema, 'tokens')
