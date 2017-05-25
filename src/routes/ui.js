const UiController = require('./../controllers/ui')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/login',
    config: {
      handler: UiController.getLogin,
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/login',
    config: {
      handler: UiController.postLogin,
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email(),
          password: Joi.string()
        },
        failAction: UiController.postLogin
      }
    }
  },
  {
    method: 'GET',
    path: '/register',
    config: {
      handler: UiController.getRegister,
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/register',
    config: {
      handler: UiController.postRegister,
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email().required()
        },
        failAction: UiController.postRegister
      }
    }
  },
  {
    method: 'GET',
    path: '/registered',
    config: {
      handler: UiController.getRegistered,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/confirmation',
    config: {
      handler: UiController.getConfirmation,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/password-reset',
    config: {
      handler: UiController.getPasswordReset,
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/password-reset',
    config: {
      handler: UiController.postPasswordReset,
      auth: false,
      validate: {
        payload: {
          code: Joi.any(),
          password: Joi.string().min(3).max(15).required(),
          passwordConfirmation: Joi.any().valid(Joi.ref('password')).required()
            .options({ language: { any: { allowOnly: 'must match password' } } })
        },
        failAction: UiController.postPasswordReset
      }
    }
  },
  {
    method: 'POST',
    path: '/password-recover',
    config: {
      handler: UiController.postPasswordRecover,
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email()
        },
        failAction: UiController.postPasswordRecover
      }
    }
  },
  {
    method: 'GET',
    path: '/password-recover',
    config: {
      handler: UiController.getPasswordRecover,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      handler: UiController.getLogout,
      auth: false
    }
  }
]
