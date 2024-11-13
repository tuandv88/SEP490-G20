import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL

export const ChatAPI = {
  getConversation: async (pageIndex, pageSize) => {
    const response = await axios.get(`${API_BASE_URL}/ai-service/conversations?PageIndex=1&PageSize=100`)
    return response.data
  },
  getMessage: async (conversationId) => {
    const response = await axios.get(`${API_BASE_URL}/ai-service/conversations/${conversationId}/messages?PageIndex=1&PageSize=10`)
    return response.data
  }
}
