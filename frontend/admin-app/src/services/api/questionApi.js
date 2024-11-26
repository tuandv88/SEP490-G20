import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'
// Method to create a question
export const createQuestion = async (questionData, quizId) => {
  try {
    const response = await axiosInstance.post(`/learning-service/quizs/${quizId}/questions`, questionData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating question:', error)
    throw error
  }
}

export const getFullQuizDetail = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/learning-service/quizs/${quizId}/full-details`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error getting full quiz detail:', error)
    throw error
  }
}

// Method to update a question
export const updateQuestion = async (quizId, questionId, questionData) => {
  try {
    const response = await axiosInstance.put(
      `/learning-service/quizs/${quizId}/questions/${questionId}`,
      questionData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating question:', error)
    throw error
  }
}
export const updateQuestionById = async (quizId, questionId, questionUpdateData) => {
  try {
    const response = await axiosInstance.put(
      `/learning-service/quizs/${quizId}/questions/${questionId}`,
      questionUpdateData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating question:', error)
    throw error
  }
}

// Method to delete a question
export const deleteQuestion = async (quizId, questionId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/quizs/${quizId}/questions/${questionId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}

export const createProblemQuestion = async (quizId, problemData) => {
  try {
    const response = await axiosInstance.post(`/learning-service/quizs/${quizId}/questions`, problemData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating problem question:', error)
    throw error
  }
}
