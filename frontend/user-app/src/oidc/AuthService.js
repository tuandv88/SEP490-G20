import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { oidcConfig } from './authConfig'

class AuthService {
  constructor() {
    this.userManager = new UserManager({
      ...oidcConfig,
      userStore: new WebStorageStateStore({ store: window.localStorage })
    })

    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded: ', user)
    })

    this.userManager.events.addUserUnloaded(() => {
      console.log('User logged out')
    })
  }

  login() {
    return this.userManager.signinRedirect()
  }

  logout() {
    return this.userManager.signoutRedirect()
  }

  getUser() {
    return this.userManager.getUser()
  }

  handleCallback() {
    return this.userManager.signinRedirectCallback()
  }
}

const authServiceInstance = new AuthService()
export default authServiceInstance
