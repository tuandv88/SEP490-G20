export const oidcConfig = {
  authority: 'https://localhost:6005',
  client_id: 'icoder.vn',
  redirect_uri: 'http://localhost:5713/callback',
  response_type: 'code',
  scope: 'openid profile email moviesApi roles offline_access',
  post_logout_redirect_uri: 'http://localhost:5713',
  loadUserInfo: true,
  requirePkce: true,
  //silent_redirect_uri: 'https://localhost:5003/silent-renew.html',
  automaticSilentRenew: true
}

