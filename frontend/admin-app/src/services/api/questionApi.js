import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'
// Method to create a question
export const createQuestion = async (questionData, quizId) => {
  try {
    const response = await axiosInstance.post(`/learning-service/quizs/${quizId}/questions`, questionData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating question:', error)
    throw error
  }
}

// Method to update a question
export const updateQuestion = async (quizId, questionId, questionData) => {
  try {
    const response = await axiosInstance.put(`/learning-service/quizs/${quizId}/questions/${questionId}`, questionData)
    return response.data
  } catch (error) {
    console.error('Error updating question:', error)
    throw error
  }
}

// Method to delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.delete(
      `/learning-service/quizs/4d9c671b-ffe6-4490-8ca1-8004e8270db4/questions/${questionId}`
    )
    return response.data
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}
