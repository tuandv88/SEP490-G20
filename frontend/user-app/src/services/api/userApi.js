import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = import.meta.env.VITE_AUTH_URL
const API_USER_URL_USER = import.meta.env.VITE_API_URL

export const UserAPI = {
  changeSurveyStatus: async (userId) => {
    const response = await axios.put(
      `${API_BASE_URL}/users/updateissurvey`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    console.log(response.data)
    return response.data
  },
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },
  getUserPoint: async () => {
    try {
      const response = await axios.get(`${API_USER_URL_USER}/user-service/total-points`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user points:', error)
      throw error
    }
  }
}
