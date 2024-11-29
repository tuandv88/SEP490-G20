import Cookies from 'js-cookie'
import axios from 'axios'
const API_BASE_URL_AUTH = import.meta.env.VITE_BASE_URL_AUTH
const axiosInstanceAuth = axios.create({
  baseURL: API_BASE_URL_AUTH,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})
export const getAllUsersDetail = async (signal) => {
  try {
    const token = Cookies.get('authToken')
    if (!token) {
      throw new Error('Không tìm thấy token xác thực')
    }

    const response = await axiosInstanceAuth.get('/users/alldetails', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: signal // Truyền signal vào request
    })

    return response.data
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      // Nếu request bị hủy, ném lại error để xử lý ở component
      throw error
    }

    if (error.response) {
      throw new Error(error.response.data.message || 'Lỗi từ server')
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server')
    } else {
      throw new Error('Có lỗi xảy ra khi gửi yêu cầu')
    }
  }
}
