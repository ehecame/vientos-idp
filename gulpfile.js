const gulp = require('gulp')
const server = require('gulp-develop-server')

gulp.task('default', ['server:start', 'server:restart'])

// run server
gulp.task('server:start', function () {
  server.listen({ path: './src/server.js' })
})

// restart server if app.js changed
gulp.task('server:restart', function () {
  gulp.watch([ 'src/**/*' ], server.restart)
})
