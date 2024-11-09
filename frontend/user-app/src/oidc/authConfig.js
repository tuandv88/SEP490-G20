export const oidcConfig = {
  authority: 'https://localhost:5001',
  client_id: 'movies_mvc_client',
  redirect_uri: 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: 'http://localhost:3000/'
}
