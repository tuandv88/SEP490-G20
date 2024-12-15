import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getCourses = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString()
    const response = await axiosInstance.get(`/learning-service/courses?${queryString}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(`/learning-service/courses/${courseId}`, courseData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateCourseImage = async (courseId, imageData) => {
  try {
    const response = await axiosInstance.put(`/learning-service/courses/${courseId}/image`, imageData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const changeCourseStatus = async (courseId, status) => {
  try {
    const response = await axiosInstance.put(`/learning-service/courses/${courseId}/change-status`, status, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const changeCourseLevel = async (courseId, level) => {
  try {
    const response = await axiosInstance.put(`/learning-service/courses/${courseId}/change-level`, level, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
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
    throw error
  }
}
