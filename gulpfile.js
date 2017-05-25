const gulp = require('gulp')
const server = require('gulp-develop-server')
const mongoose = require('mongoose')
const seeder = require('mongoose-seed')


const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/vientos-idp'
const VIENTOS_SERVICE_URL = process.env.VIENTOS_SERVICE_URL || 'http://localhost:8000'
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
        'redirectUris': [VIENTOS_SERVICE_URL],
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
