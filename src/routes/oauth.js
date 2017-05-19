const oAuthController = require('./../controllers/oAuth')

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
  }
]
