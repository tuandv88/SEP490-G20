import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_API_URL

export const LearningPathAPI = {
  swapCourseInPath: async (pathSteps) => {
    const response = await axios.put(`${API_BASE_URL}/user-service/pathsteps`, pathSteps, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  deletePathStep: async (pathStepId) => {
    const response = await axios.delete(`${API_BASE_URL}/user-service/pathsteps/${pathStepId}`, {
      headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
    })
    return response.data
  },
  createPathStep: async (pathStep) => {
    const response = await axios.post(`${API_BASE_URL}/user-service/pathsteps`, pathStep, {
      headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
    })
    return response.data
  },
  deleteLearningPath: async (pathId) => {
    const response = await axios.delete(`${API_BASE_URL}/user-service/learningpaths/${pathId}`, {
      headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
    })
    return response.data
  }
}
