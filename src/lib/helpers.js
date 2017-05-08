const i18n = require('i18n')

function formatErrors (hapiError) {
  let formatted = []
  if (hapiError && hapiError.data && hapiError.data.name === 'ValidationError') {
    hapiError.data.details.forEach(err => {
      let template = err.message.replace(/"(.*?)"/, '"%s"')
      formatted[err.path] = i18n.__(template, err.path)
    })
  }
  return formatted
}

module.exports = {
  formatErrors: formatErrors
}
