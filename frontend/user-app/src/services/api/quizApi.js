import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'https://localhost:5000'

export const QuizAPI = {
  getQuizDetails: async (quizId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/quizs/${quizId}/details`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  startQuiz: async (quizId) => {
    const response = await axios.post(
      `${API_BASE_URL}/learning-service/quizs/${quizId}/start`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  submissionAnswer: async (submissionId, question) => {
    const response = await axios.put(
      `${API_BASE_URL}/learning-service/quizs/submission/${submissionId}/answer`,
      {
        question
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  submitCodeSnippet: async (submissionId, question) => {
    const response = await axios.put(
      `${API_BASE_URL}/learning-service/quizs/submission/${submissionId}/answer`,
      { question },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  getQuizSubmission: async (quizId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/quizs/${quizId}/submissions`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getQuizSubmission: async (quizId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/quizs/${quizId}/submissions`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  submitQuiz: async (submissionId) => {
    const response = await axios.put(`${API_BASE_URL}/learning-service/quizs/submission/${submissionId}`, {}, {
      headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
    })
    return response.data
  }
}
