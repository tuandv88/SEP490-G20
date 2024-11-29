const VITE_AUTH_URL = import.meta.env.VITE_AUTH_URL
const VITE_CALLBACK_URL = import.meta.env.VITE_CALLBACK_URL

export const oidcConfig = {
  authority: VITE_AUTH_URL,
  client_id: 'icoder.vn',
  redirect_uri: `${VITE_CALLBACK_URL}/callback`,
  response_type: 'code',
  scope: 'openid profile email moviesApi roles offline_access',
  post_logout_redirect_uri: VITE_CALLBACK_URL,
  loadUserInfo: true,
  requirePkce: true,
  //silent_redirect_uri: 'https://localhost:5003/silent-renew.html',
  automaticSilentRenew: true
}
