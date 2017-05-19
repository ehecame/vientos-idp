const OAuth2Server = require('oauth2-server')
const OAuthModel = require('../lib/oAuthModel')
const Request = OAuth2Server.Request
const Response = OAuth2Server.Response

const oAuth = new OAuth2Server({
  model: OAuthModel,
  authenticateHandler: {
    handle: (request, response) => {
      console.log(request.headers.cookie)
      return request.user
    }
  }
})

function authorize (request, reply) {
  let oAuthRequest = new Request({
    headers: request.raw.req.headers,
    method: request.raw.req.method,
    body: request.payload,
    query: request.query,
    user: request.auth.credentials
  })

  let oAuthResponse = new Response(request.raw.res)

  return oAuth.authorize(oAuthRequest, oAuthResponse, {})
    .then(() => {
      return reply.redirect(oAuthResponse.headers.location)
    })
}

module.exports = {
  authorize: authorize
}
