import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ChatAPI = {
  getConversation: async (pageIndex, pageSize) => {
    const response = await axios.get(`${API_BASE_URL}/ai-service/conversations?PageIndex=1&PageSize=100`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getMessage: async (conversationId) => {
    const response = await axios.get(`${API_BASE_URL}/ai-service/conversations/${conversationId}/messages?PageIndex=1&PageSize=10`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  }
}
