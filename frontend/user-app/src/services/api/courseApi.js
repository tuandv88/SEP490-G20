import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_API_URL

export const CourseAPI = {
  getEnrolledCourses: async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/${courseId}/enrollment/info`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  enrollCourse: async (id) => {
    const response = await axios.post(
      `${API_BASE_URL}/learning-service/courses/${id}/enrollment/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  }
}
