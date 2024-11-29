import axios from 'axios'
import Cookies from 'js-cookie';
const API_BASE_URL = import.meta.env.VITE_API_URL

export const LearningAPI = {
  getCourseList: async (pageIndex, pageSize) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses?${pageIndex}&${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getCoursePreview: async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },


  getCourseDetails: async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/${courseId}/details`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getLectureDetails: async (lectureId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/lectures/${lectureId}/details`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getLectureFiles: async (lectureId, fileId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/lectures/${lectureId}/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  excuteCode: async (problemId, submissionData) => {
    const response = await axios.post(`${API_BASE_URL}/learning-service/problems/${problemId}/run`, submissionData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  submitCode: async (problemId, submissionData) => {
    const response = await axios.post(`${API_BASE_URL}/learning-service/problems/${problemId}/submission`, submissionData, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getLearningPath: async () => {
    const response = await axios.get(`${API_BASE_URL}/user-service/users/learning-path`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  }
}
