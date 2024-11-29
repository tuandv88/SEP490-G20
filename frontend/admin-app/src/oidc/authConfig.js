const API_BASE_URL_AUTH = import.meta.env.VITE_BASE_URL_AUTH
const API_BASE_URL_CALLBACK = import.meta.env.VITE_BASE_URL_CALLBACK

export const oidcConfig = {
  authority: API_BASE_URL_AUTH,
  client_id: 'icoder.vn',
  redirect_uri: `${API_BASE_URL_CALLBACK}/callback`,
  response_type: 'code',
  scope: 'openid profile email moviesApi roles offline_access',
  post_logout_redirect_uri: API_BASE_URL_CALLBACK,
  loadUserInfo: true,
  requirePkce: true,
  //silent_redirect_uri: 'https://localhost:5003/silent-renew.html',
  automaticSilentRenew: true
}
