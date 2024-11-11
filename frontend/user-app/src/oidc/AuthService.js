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

    // Xử lý gia hạn token tự động
    this.userManager.events.addAccessTokenExpiring(() => {
      console.log("Access token sắp hết hạn. Bắt đầu gia hạn token...")
      this.userManager.signinSilent().then((user) => {
        console.log("Access token mới:", user.access_token)
      }).catch((err) => {
        console.error("Lỗi gia hạn token:", err)
      })
    })

    this.userManager.events.addSilentRenewError((err) => {
      console.error("Gia hạn token ngầm thất bại:", err)
    })
  }

  login() {
    return this.userManager.signinRedirect()
  }

  callApi() {
    return this.getUser().then(user => {
      if (user) {
        console.log("User's access token:", user.access_token)
        // Gọi API bảo vệ với access token
        // Đặt các hàm gọi API ở đây nếu cần
      } else {
        console.log("User is not logged in")
      }
    })
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