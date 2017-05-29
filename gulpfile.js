const gulp = require('gulp')
const server = require('gulp-develop-server')
const mongoose = require('mongoose')
const seeder = require('mongoose-seed')

const MONGO_URL = process.env.IDP_MONGO_URL || 'mongodb://localhost:27017/vientos-idp'
const OAUTH_CLIENT_REDIRECT_URI = process.env.OAUTH_CLIENT_REDIRECT_PATH || 'http://localhost:3000/auth/vientos'

const VIENTOS_CLIENT_ID = process.env.VIENTOS_CLIENT_ID || '12345678'
const VIENTOS_CLIENT_SECRET = process.env.VIENTOS_CLIENT_SECRET || '12345678'

gulp.task('default', ['server:start', 'server:restart'])

// run server
gulp.task('server:start', function () {
  server.listen({ path: './src/server.js' })
})

// restart server if app.js changed
gulp.task('server:restart', function () {
  gulp.watch([ 'src/**/*' ], server.restart)
})

// seed db,
gulp.task('db:seed', () => {
  seeder.connect(MONGO_URL, () => {
    seeder.loadModels([
      'src/models/authorizationCode.js',
      'src/models/client.js',
      'src/models/passwordReset.js',
      'src/models/token.js',
      'src/models/user.js'
    ])

    var data = [{
      'model': 'Client',
      'documents': [{
        'clientId': VIENTOS_CLIENT_ID,
        'secret': VIENTOS_CLIENT_SECRET,
        'redirectUris': [OAUTH_CLIENT_REDIRECT_URI],
        'grantTypes': ['authorization_code'],
        'scope': 'profile'
      }]
    }]

    seeder.clearModels(['AuthorizationCode', 'Client', 'PasswordReset', 'Token', 'User'], () => {
      seeder.populateModels(data, () => {
        mongoose.disconnect()
      })
    })
  })
})
