const AuthorizationCode = require('../models/authorizationCode')
const Client = require('../models/client')
const Token = require('../models/token')

function getAccessToken (accessToken, callback) {
  return Token.findOne({ accessToken: accessToken })
    .then(token => ({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.expiresAt,
      client: { id: token.clinet },
      user: { id: token.user }
    }))
}

function saveToken (token, client, user) {
  return Token.create({
    accessToken: token.accessToken,
    expiresAt: token.accessTokenExpiresAt,
    client: client.id,
    user: user.id
  })
  .then(token => ({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.expiresAt,
    client: { id: token.client },
    user: { id: token.user }
  }))
}

function getAuthorizationCode (authorizationCode) {
  return AuthorizationCode.findOne({
    code: authorizationCode,
    expiresAt: { $gt: new Date().toISOString() }
  })
  .then(code => ({
    code: code.code,
    expiresAt: code.expiresAt,
    client: { id: code.client },
    user: { id: code.user }
  }))
}

function saveAuthorizationCode (code, client, user) {
  return AuthorizationCode.create({
    code: code.authorizationCode,
    expiresAt: code.expiresAt,
    client: client.id,
    user: user.id
  })
  .then(code => ({
    authorizationCode: code.code,
    expiresAt: code.expiresAt,
    client: { id: code.client },
    user: { id: code.user }
  }))
}

function revokeAuthorizationCode (code) {
  return AuthorizationCode.findOne({
    code: code.code
  })
  .then(code => {
    code.expiresAt = new Date().toISOString()
    return code.save()
  })
}

function getClient (clientId, clientSecret) {
  let params = {}
  if (clientId) {
    params.id = clientId
  }
  if (clientSecret) {
    params.clientSecret = clientSecret
  }
  return Client.findOne(params)
    .then(client => {
      if (!client) {
        throw new Error('Client not found')
      }
      return {
        id: client.id,
        grants: client.grantTypes,
        redirectUris: [client.redirectUri]
      }
    })
}

module.exports = {
  getAccessToken: getAccessToken,
  saveToken: saveToken,
  getAuthorizationCode: getAuthorizationCode,
  saveAuthorizationCode: saveAuthorizationCode,
  revokeAuthorizationCode: revokeAuthorizationCode,
  getClient: getClient
}
