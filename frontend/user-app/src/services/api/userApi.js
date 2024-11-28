import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = import.meta.env.VITE_AUTH_URL

export const UserAPI = {
  changeSurveyStatus: async (userId) => {
    const response = await axios.put(`${API_BASE_URL}/users/updateissurvey`, {userId}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    console.log(response.data)
    return response.data
  }
}
