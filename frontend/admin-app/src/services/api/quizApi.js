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
