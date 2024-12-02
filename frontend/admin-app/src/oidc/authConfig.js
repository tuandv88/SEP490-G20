const API_BASE_URL_AUTH = import.meta.env.VITE_BASE_URL_AUTH
const API_BASE_URL_CALLBACK = import.meta.env.VITE_BASE_URL_CALLBACK
const VITE_OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID
const VITE_OAUTH_CLIENT_SCOPE = import.meta.env.VITE_OAUTH_CLIENT_SCOPE

export const oidcConfig = {
  authority: API_BASE_URL_AUTH,
  client_id: VITE_OAUTH_CLIENT_ID,
  redirect_uri: ${API_BASE_URL_CALLBACK}/callback,
  response_type: 'code',
  scope: VITE_OAUTH_CLIENT_SCOPE,
  post_logout_redirect_uri: API_BASE_URL_CALLBACK,
  loadUserInfo: true,
  requirePkce: true,
  //silent_redirect_uri: 'https://localhost:5003/silent-renew.html',
  automaticSilentRenew: true
}