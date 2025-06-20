import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { oidcConfig } from './authConfig'
import Cookies from 'js-cookie'

class AuthService {
  constructor() {
    this.userManager = new UserManager({
      ...oidcConfig,
      userStore: new WebStorageStateStore({ store: window.localStorage })
    })

    this.userManager.events.addUserLoaded((user) => {
      Cookies.set('authToken', user.access_token, { expires: 7 })
    })

    this.userManager.events.addUserUnloaded(() => {
      Cookies.remove('authToken')
    })

    // Xử lý gia hạn token tự động
    this.userManager.events.addAccessTokenExpiring(() => {
      this.userManager
        .signinSilent()
        .then((user) => {
        })
        .catch((err) => {
        })
    })

    this.userManager.events.addSilentRenewError((err) => {
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

  callApi() {
    return this.getUser().then((user) => {
      if (user) {

        // Thực hiện gọi API bảo vệ
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://localhost:6002/api/movies') // URL của API bảo vệ
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.access_token) // Gửi access token trong header

        xhr.onload = function () {
        }

        xhr.onerror = function () {
        }

        xhr.send()
      } else {
      }
    })
  }
}

const authServiceInstance = new AuthService()
export default authServiceInstance
