import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const createProblem = async (problemData) => {
  try {
    const response = await axiosInstance.post('/learning-service/problems', problemData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error create problem:', error)
    throw error
  }
}
export const updateProblem = async (problemId, problemData) => {
  try {
    const response = await axiosInstance.put(`/learning-service/problems/${problemId}`, problemData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error update problem:', error)
    throw error
  }
}
export const deleteProblem = async (problemId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/problems/${problemId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error delete problem:', error)
    throw error
  }
}
