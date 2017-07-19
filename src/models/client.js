module.exports = {
  id: process.env.VIENTOS_CLIENT_ID,
  secret: process.env.VIENTOS_CLIENT_SECRET,
  grants: ['authorization_code'],
  redirectUris: [process.env.OAUTH_CLIENT_REDIRECT_URI],
  scope: 'profile'
}
