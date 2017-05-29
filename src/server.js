const fs = require('fs')
const http2 = require('http2')
const Hapi = require('hapi')
const AuthCookie = require('hapi-auth-cookie')
const Vision = require('vision')
const Handlebars = require('handlebars')
const i18n = require('i18n')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')

const httpServerOptions = {}
if (process.env.TLS_KEY_PATH && process.env.TLS_CERT_PATH) {
  httpServerOptions.key = fs.readFileSync(process.env.TLS_KEY_PATH)
  httpServerOptions.cert = fs.readFileSync(process.env.TLS_CERT_PATH)
}

const PORT = process.env.IDP_PORT || 4000
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || 'it-should-have-min-32-characters'
const NODE_ENV = process.env.NODE_ENV || 'development'
const IDP_MONGO_URL = process.env.IDP_MONGO_URL || 'mongodb://localhost:27017/vientos-idp'

mongoose.Promise = global.Promise
mongoose.connect(IDP_MONGO_URL, { promiseLibrary: global.Promise })

const server = new Hapi.Server()

Handlebars.registerHelper('i18n', str => (i18n !== undefined ? i18n.__(str) : str))

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '/locales')
})

const connectionOptions = {
  port: PORT,
  routes: { cors: { credentials: true, exposedHeaders: ['location'] } },
  state: { isSameSite: false } // required for CORS
}
if (httpServerOptions.key && httpServerOptions.cert) {
  connectionOptions.listener = http2.createServer(httpServerOptions)
}

server.connection(connectionOptions)

server.register([AuthCookie, Vision], (err) => {
  if (err) throw err

  const IS_SECURE = NODE_ENV === 'production'

  server.auth.strategy('session', 'cookie', true, {
    password: COOKIE_PASSWORD,
    isSecure: IS_SECURE,
    redirectTo: '/login',
    appendNext: true,
    validateFunc: (request, session, callback) => {
      if (!session.id) {
        return callback(null, true)
      }
      User.findById(session.id)
        .then(user => {
          if (!user) {
            return callback(null, false)
          }
          return callback(null, true, { id: user.id })
        })
        .catch(err => {
          callback(err, false)
        })
    }
  })
  server.route(require('./routes/oauth'))
})

server.views({
  engines: { html: Handlebars },
  path: 'views',
  layoutPath: 'views/layouts',
  layout: 'default',
  relativeTo: __dirname
})

server.route(require('./routes/ui'))

// don't start if required from other script
if (!module.parent) {
  server.start((err) => {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })
}

module.exports = server
