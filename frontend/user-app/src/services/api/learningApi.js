import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const LearningAPI = {
  getCourseList: async (pageIndex, pageSize) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses?${pageIndex}&${pageSize}`)
    return response.data
  },
  getCourseDetails: async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/${courseId}/details`)
    return response.data
  },
  getLectureDetails: async (lectureId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/lectures/${lectureId}/details`)
    return response.data
  },
  getLectureFiles: async (lectureId, fileId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/lectures/${lectureId}/files/${fileId}`)
    return response.data
  },
  excuteCode: async (problemId, submissionData) => {
    const response = await axios.post(`${API_BASE_URL}/learning-service/problems/${problemId}/run`, submissionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  }
}
