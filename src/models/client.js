module.exports = {
  id: process.env.IDP_CLIENT_ID,
  secret: process.env.IDP_CLIENT_SECRET,
  grants: ['authorization_code'],
  redirectUris: [process.env.IDP_CLIENT_REDIRECT_URL],
  scope: 'profile'
}
