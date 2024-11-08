import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Thay thế bằng URL API thực tế của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor để xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi ở đây (ví dụ: refresh token, logout nếu 401, etc.)
    return Promise.reject(error)
  }
)

export default axiosInstance
