import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const runCode = async (codeData) => {
  try {
    const response = await axiosInstance.post('/learning-service/submissions/batch', codeData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error run code:', error)
    throw error
  }
}
