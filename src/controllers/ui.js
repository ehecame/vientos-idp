const User = require('../models/user')
const PasswordReset = require('../models/passwordReset')
const i18n = require('i18n')
const uuid = require('uuid/v4')
const passwordHash = require('password-hash')
const helpers = require('../lib/helpers')
const mailSender = require('../lib/mailSender.js')

const URL_ROOT = process.env.VIENTOS_IDP_URL

function getLogin (request, reply) {
  return reply.view('login', { next: encodeURIComponent(request.query.next) })
}

function postLogin (request, reply, source, error) {
  var errors = helpers.formatErrors(error)
  if (Object.keys(errors).length > 0) {
    return reply.view('login', {
      errors: errors,
      next: encodeURIComponent(request.query.next)
    })
    .code(400)
  }

  return User.findOne({ email: request.payload.email })
    .then(user => {
      if (!user) {
        errors['email'] = i18n.__('"email" is invaid')
        return reply.view('login', {
          errors: errors,
          email: request.payload.email,
          next: encodeURIComponent(request.query.next)
        })
        .code(400)
      }
      if (!passwordHash.verify(request.payload.password, user.password)) {
        errors['password'] = i18n.__('Invalid password')
        return reply.view('login', {
          errors: errors,
          email: request.payload.email,
          next: encodeURIComponent(request.query.next)
        })
        .code(400)
      }
      request.cookieAuth.set({id: user.id})

      if (request.query.next) {
        return reply.redirect(request.query.next)
      }

      return reply.view('info', { title: i18n.__('Success') })
    })
}

function getRegister (request, reply) {
  reply.view('register')
}

function postRegister (request, reply, source, error) {
  var errors = helpers.formatErrors(error)
  if (Object.keys(errors).length > 0) {
    return reply.view('register', { errors: errors, email: request.payload.email })
      .code(400)
  }
  return User.findOne({email: request.payload.email}).then(user => {
    if (user) {
      let errors = []
      errors['email'] = i18n.__('Email already exists')
      return reply.view('register', { errors: errors, email: request.payload.email })
        .code(400)
    }
    return User.create({
      // temporary email
      email: uuid() + '@vientos.coop',
      desiredEmail: request.payload.email,
      confirmationCode: uuid()
    }).then(user => {
      let confirmationUrl = URL_ROOT + '/confirmation?code=' + user.confirmationCode

      return mailSender.sendEmailAsText(user.desiredEmail, i18n.__('Vientos Registration'), confirmationUrl)
    })
    .then(() => {
      return reply.redirect('/registered')
    })
    .catch(e => console.log(e))
  })
}

function getRegistered (request, reply) {
  return reply.view('registered')
}

function getConfirmation (request, reply) {
  return User.findOne({
    confirmationCode: request.query.code,
    confirmDate: { $exists: false }
  })
  .then(user => {
    if (user) {
      user.email = user.desiredEmail
      user.confirmDate = new Date().toISOString()
      return user.save()
    }
    return user
  })
  .then(user => {
    if (!user) {
      return reply.view('error', { message: i18n.__('Sorry this link is invalid') })
    }
    return PasswordReset.create({
      email: user.email,
      code: uuid()
    })
    .then(reset => {
      return reply.redirect('/password-reset?code=' + reset.code)
    })
  })
}

function getPasswordReset (request, reply) {
  return PasswordReset.findOne({
    code: request.query.code,
    resetDate: { $exists: false }
  })
  .then(reset => {
    if (!reset) {
      return reply.view('error', { message: i18n.__('Sorry this link is invalid') })
    }
    return reply.view('password-reset', { code: reset.code })
  })
}

function postPasswordReset (request, reply, source, error) {
  var errors = helpers.formatErrors(error)
  if (Object.keys(errors).length > 0) {
    return reply.view('password-reset', { errors: errors, code: request.payload.code })
      .code(400)
  }
  return PasswordReset.findOne({
    code: request.payload.code,
    resetDate: { $exists: false }
  })
  .then(reset => {
    if (reset) {
      return User.findOne({email: reset.email})
    }
    return null
  })
  .then(user => {
    if (user) {
      user.password = passwordHash.generate(request.payload.password)
      user.resetDate = new Date().toISOString()
      return user.save()
    }
    return null
  })
  .then(user => {
    if (!user) {
      return reply.view('error', { message: i18n.__('Unknow error') })
    }
    request.cookieAuth.set({id: user.id})
    return reply.view('info', { title: i18n.__('Success') })
  })
}

function getPasswordRecover (request, reply) {
  reply.view('password-recover')
}

function postPasswordRecover (request, reply) {
  return PasswordReset.create({
    email: request.payload.email,
    code: uuid()
  }).then(reset => {
    let resetUrl = URL_ROOT + '/password-reset?code=' + reset.code

    return mailSender.sendEmailAsText(reset.email, i18n.__('Vientos Password Reset'), resetUrl)
  })
  .then(() => {
    return reply.view('password-recover-sent')
  })
  .catch(e => console.log(e))
}

function getLogout (request, reply) {
  request.cookieAuth.clear()
  return reply.view('info', { title: i18n.__('Success') })
}

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getRegistered,
  getConfirmation,
  getPasswordReset,
  postPasswordReset,
  getPasswordRecover,
  postPasswordRecover,
  getLogout: getLogout
}
