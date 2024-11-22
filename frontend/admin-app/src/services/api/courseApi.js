import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getCourses = async (pageIndex, pageSize) => {
  try {
    const response = await axiosInstance.get('/learning-service/courses', {
      params: { pageIndex, pageSize },
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    console.log('API Response:', response.data)
    return response.data.courseDtos.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/learning-service/courses', courseData, {
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

export const getCourseDetails = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/learning-service/courses/${courseId}/details`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching course details:', error)
    throw error
  }
}
