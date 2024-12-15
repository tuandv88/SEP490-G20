import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL =  import.meta.env.VITE_API_URL

export const ChatAPI = {
  
  getConversation: async (pageIndex, pageSize = 4) => {
    const response = await axios.get(`${API_BASE_URL}/ai-service/conversations?PageIndex=${pageIndex}&PageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getMessage: async (conversationId) => {
    const response = await axios.get(
      `${API_BASE_URL}/ai-service/conversations/${conversationId}/messages?PageIndex=1&PageSize=30`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  deleteConversation: async (conversationId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/ai-service/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  }
}
