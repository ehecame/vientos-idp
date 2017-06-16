const Mailjet = require('node-mailjet').connect(
  process.env.MAILJET_APIKEY_PUBLIC,
  process.env.MAILJET_APIKEY_SECRET
)

const FROM_EMAIL = process.env.FROM_EMAIL

function sendEmailAsText (to, subject, text) {
  const emailData = {
    FromEmail: FROM_EMAIL,
    Recipients: [{ Email: to }],
    Subject: subject,
    'Text-part': text
  }
  return Mailjet.post('send').request(emailData)
}

module.exports = {
  sendEmailAsText: sendEmailAsText
}
