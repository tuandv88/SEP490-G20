import axios from 'axios'

const API_BASE_URL = 'https://localhost:5000/ai-service/conversations'

export const ChatAPI = {
  getConversation: async (pageIndex, pageSize) => {
    const response = await axios.get(`${API_BASE_URL}/?PageIndex=1&PageSize=100`)
    return response.data
  },
  getMessage: async (conversationId) => {
    const response = await axios.get(`${API_BASE_URL}/${conversationId}/messages?PageIndex=1&PageSize=10`)
    return response.data
  }
}
