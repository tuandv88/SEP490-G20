import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_API_URL

export const CourseAPI = {
  getEnrolledCourses: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/${id}/enrollment/info`,
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
  },
  getCoursePopular: async (pageIndex, pageSize) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/most-popular?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  getCourseList: async (pageIndex = 1, pageSize = 20, searchString = '') => {
    const params = new URLSearchParams({
      PageIndex: pageIndex,
      PageSize: pageSize,
      SearchString: searchString
    });

    const response = await axios.get(`${API_BASE_URL}/learning-service/courses?${params.toString()}`);
    return response.data;
  },
  updateCourseProgress: async (courseId, lectureId) => {
    const response = await axios.put(`${API_BASE_URL}/learning-service/courses/${courseId}/progress/${lectureId}`, { 
      duration: 0
     },
     {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
     }
    );
    console.log(response)
    return response.data;
  },
  getCourseProgress: async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/${courseId}/progress`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  },
  getUserEnrollments: async (pageIndex = 1, pageSize = 10) => {
    const response = await axios.get(`${API_BASE_URL}/learning-service/courses/u/enrollments?PageIndex=${pageIndex}&PageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  }
}
