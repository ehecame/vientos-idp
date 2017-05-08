const helper = require('sendgrid').mail
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)

function sendEmailAsText (from, to, subject, content) {
  console.log(process.env.SENDGRID_API_KEY)
  let mail = new helper.Mail(
    new helper.Email(from),
    subject,
    new helper.Email(to),
    new helper.Content('text/plain', content)
  )

  let request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })
  return sg.API(request)
}

module.exports = {
  sendEmailAsText: sendEmailAsText
}
