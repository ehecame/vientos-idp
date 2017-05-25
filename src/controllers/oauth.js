const OAuth2Server = require('oauth2-server')
const OAuthModel = require('../lib/oAuthModel')
const Request = OAuth2Server.Request
const Response = OAuth2Server.Response

const oAuth = new OAuth2Server({
  model: OAuthModel,
  authenticateHandler: {
    handle: (request, response) => {
      return request.user
    }
  },
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

  return oAuth.authorize(oAuthRequest, oAuthResponse, {})
    .then(() => {
      return reply.redirect(oAuthResponse.headers.location)
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
      return reply(oAuthResponse.body)
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
        user_id: token.user,
        email: token.user.email,
        name: token.user.email,
        given_name: '',
        family_name: ''
      })
    })
}

module.exports = {
  authorize: authorize,
  token: token,
  userinfo: userinfo
}
