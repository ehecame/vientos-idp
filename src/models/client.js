
var Mongoose = require('mongoose')

const ClientSchema = new Mongoose.Schema({
  id: String,
  redirectUri: String,
  grantTypes: String,
  scope: String
})

module.exports = Mongoose.model('Client', ClientSchema, 'clients')
