const VITE_AUTH_URL = import.meta.env.VITE_AUTH_URL
const VITE_CALLBACK_URL = import.meta.env.VITE_CALLBACK_URL
const VITE_OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID
const VITE_OAUTH_CLIENT_SCOPE = import.meta.env.VITE_OAUTH_CLIENT_SCOPE
const API_BASE_URL_CALLBACK = import.meta.env.VITE_CALLBACK_URL

export const oidcConfig = {
  authority: VITE_AUTH_URL,
  client_id: VITE_OAUTH_CLIENT_ID,
  redirect_uri: `${API_BASE_URL_CALLBACK}/callback`,
  response_type: 'code',
  scope: VITE_OAUTH_CLIENT_SCOPE,
  post_logout_redirect_uri: VITE_CALLBACK_URL,
  loadUserInfo: true,
  requirePkce: true,
  //silent_redirect_uri: 'https://localhost:5003/silent-renew.html',
  automaticSilentRenew: true
}