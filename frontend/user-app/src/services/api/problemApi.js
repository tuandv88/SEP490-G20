import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const ProblemAPI = {
  getProblem: async (problemId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/problems/${problemId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getSubmissionHistory: async (problemId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/problems/${problemId}/submissions`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getAllProblems: async (pageIndex, pageSize, searchString = '') => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/problems`, {
      params: {
        PageIndex: pageIndex,
        PageSize: pageSize,
        SearchString: searchString
      }
    })
    return response.data
  },
  getProblemDetails: async (problemId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/problems/${problemId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getProblemHome: async (pageIndex, pageSize) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/learning-service/problems?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching problems:', error)
    }
  },
  getProblemSolved: async () => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/problems/solved-by-difficulty`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getSolvedProblems: async () => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/problems`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    const solvedProblems = response.data.problems.data.filter((problem) => problem.status === 'Solved')
    return solvedProblems
  },
  getLeaderboard: async (pageIndex, pageSize) => {
    const response = await axios.get(
      `${API_BASE_URL}/learning-service/problems/leadboards?PageIndex=${pageIndex}&PageSize=${pageSize}`
    )
    return response.data
  }
}
