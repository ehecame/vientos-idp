const oAuthController = require('./../controllers/oauth')

module.exports = [
  {
    method: 'GET',
    path: '/authorize',
    config: {
      handler: oAuthController.authorize,
      auth: {
        strategy: 'session'
      }
    }
  },
  {
    method: 'POST',
    path: '/token',
    config: {
      handler: oAuthController.token,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/userinfo',
    config: {
      handler: oAuthController.userinfo,
      auth: false
    }
  }
]
