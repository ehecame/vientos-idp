
var Mongoose = require('mongoose')

const ClientSchema = new Mongoose.Schema({
  clientId: String,
  secret: String,
  redirectUris: [String],
  grantTypes: [String],
  scope: String
})

module.exports = Mongoose.model('Client', ClientSchema, 'clients')
