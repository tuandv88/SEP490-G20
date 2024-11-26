import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getProblems = async (pageIndex, pageSize) => {
  try {
    const response = await axiosInstance.post(
      `/learning-service/problems?LectureId=${lectureId}`,
      problemData,
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error create problem:', error)
    throw error
  }
}

export const createProblemAg = async (problemData) => {
  try {
    const response = await axiosInstance.post(
      `/learning-service/problems`,
      problemData,
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error create problem:', error)
    throw error
  }
}

export const getProblemDetail = async (problemId) => {
  try {
    const response = await axiosInstance.get(`/learning-service/problems/${problemId}/details`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error get problem detail:', error)
    throw error
  }
}

export const updateProblemAg = async (problemData, problemId) => {
  try {
    const response = await axiosInstance.put(`/learning-service/problems/${problemId}`, problemData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error update problem:', error)
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
