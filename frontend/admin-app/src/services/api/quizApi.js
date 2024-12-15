import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const createQuiz = async (quizData, lectureId) => {
  try {
    const response = await axiosInstance.post(`/learning-service/quizs?LectureId=${lectureId}`, quizData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

export const deleteQuiz = async (quizId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/quizs/${quizId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting quiz:', error)
    throw error
  }
}

export const getQuizAssessment = async () => {
  try {
    const response = await axiosInstance.get('/learning-service/quizs/assessment', {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export const createQuizAssessment = async (quizData) => {
  try {
    const response = await axiosInstance.post(`/learning-service/quizs`, quizData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

export const updateQuiz = async (quizId, quizData) => {
  try {
    const response = await axiosInstance.put(`/learning-service/quizs/${quizId}`, quizData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw error
  }
}

export const updateProblemQuestion = async (quizId, questionId, quizData) => {
  try {
    const response = await axiosInstance.put(`/learning-service/quizs/${quizId}/questions/${questionId}`, quizData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw error
  }
}
