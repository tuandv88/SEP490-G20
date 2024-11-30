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
      console.log('User loaded: ', user)
    })

    this.userManager.events.addUserUnloaded(() => {
      console.log('User logged out')
    })

    // Xử lý gia hạn token tự động
    this.userManager.events.addAccessTokenExpiring(() => {
      console.log('Access token sắp hết hạn. Bắt đầu gia hạn token...')
      this.userManager
        .signinSilent()
        .then((user) => {
          console.log('Access token mới:', user.access_token)
        })
        .catch((err) => {
          console.error('Lỗi gia hạn token:', err)
        })
    })

    this.userManager.events.addSilentRenewError((err) => {
      console.error('Gia hạn token ngầm thất bại:', err)
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
        console.log("User's access token using for API:", user.access_token)

        // Thực hiện gọi API bảo vệ
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://localhost:6002/api/movies') // URL của API bảo vệ
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.access_token) // Gửi access token trong header

        xhr.onload = function () {
          console.log('API response: ', xhr.responseText)
        }

        xhr.onerror = function () {
          console.error('Error while calling API')
        }

        xhr.send()
      } else {
        console.error('User is not logged in')
      }
    })
  }
}

const authServiceInstance = new AuthService()
export default authServiceInstance
