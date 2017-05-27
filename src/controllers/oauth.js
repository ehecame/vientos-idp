const OAuth2Server = require('oauth2-server')
const OAuthModel = require('../lib/oAuthModel')
const Request = OAuth2Server.Request
const Response = OAuth2Server.Response

const oAuth = new OAuth2Server({
  model: OAuthModel,

  // for easy tesing
  authorizationCodeLifetime: 1000
})

function authorize (request, reply) {
  let oAuthRequest = new Request({
    headers: request.raw.req.headers,
    method: request.raw.req.method,
    query: request.query,
    user: request.auth.credentials
  })

  let oAuthResponse = new Response(request.raw.res)
  return oAuth.authorize(oAuthRequest, oAuthResponse, {
    authenticateHandler: {
      handle: (request, response) => request.user
    }
  })
  .then(() => {
    return replyWithHapi(oAuthResponse, reply)
  })
  .catch(e => {
    return replyWithHapi(oAuthResponse, reply, e)
  })
}

function token (request, reply) {
  let oAuthRequest = new Request({
    headers: request.raw.req.headers,
    method: request.raw.req.method,
    query: request.query,
    body: request.payload
  })

  let oAuthResponse = new Response(request.raw.res)
  return oAuth.token(oAuthRequest, oAuthResponse, {})
    .then(() => {
      return replyWithHapi(oAuthResponse, reply)
    })
    .catch(e => {
      return replyWithHapi(oAuthResponse, reply, e)
    })
}

function userinfo (request, reply) {
  let oAuthRequest = new Request({
    headers: request.raw.req.headers,
    method: request.raw.req.method,
    query: request.query,
    body: request.payload
  })

  let oAuthResponse = new Response(request.raw.res)
  return oAuth.authenticate(oAuthRequest, oAuthResponse, {})
    .then(token => {
      return reply({
        id: token.user.id,
        email: token.user.email
      })
    })
    .catch(e => {
      return replyWithHapi(oAuthResponse, reply, e)
    })
}

function replyWithHapi (oAuthResponse, reply, error) {
  let response = reply(oAuthResponse.body).hold()
  Object.keys(oAuthResponse.headers).forEach(key => {
    response.header(key, oAuthResponse.headers[key], {})
  })
  response.query = oAuthResponse.query
  response.code(oAuthResponse.status)

  if (error) {
    response.source = { error: error.name, error_description: error.message }
    response.code(error.code)
  }
  response.send()
}

module.exports = {
  authorize: authorize,
  token: token,
  userinfo: userinfo
}
