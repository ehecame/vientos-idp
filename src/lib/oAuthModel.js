const AuthorizationCode = require('../models/authorizationCode')
const client = require('../models/client')
const Token = require('../models/token')

function getAccessToken (accessToken) {
  return Token.findOne({ accessToken: accessToken })
    .populate('user')
    .then(token => {
      if (!token) {
        return null
      }
      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.expiresAt,
        client: { id: client.id },
        user: { id: token.user.id, email: token.user.email }
      }
    })
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
    client: { id: client.id },
    user: { id: code.user }
  }))
  .catch(e => {
    console.log('aaaaa')
  })
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
    client: code.client.id,
    user: code.user.id
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
  if (!clientId || client.id !== clientId || (clientSecret && client.secret !== clientSecret)) return null
  return {
    id: client.id,
    grants: client.grants,
    redirectUris: client.redirectUris
  }
}

module.exports = {
  getAccessToken: getAccessToken,
  saveToken: saveToken,
  getAuthorizationCode: getAuthorizationCode,
  saveAuthorizationCode: saveAuthorizationCode,
  revokeAuthorizationCode: revokeAuthorizationCode,
  getClient: getClient
}
