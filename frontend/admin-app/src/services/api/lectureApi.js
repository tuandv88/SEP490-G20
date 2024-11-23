import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const createLecture = async (chapterId, lectureData) => {
  try {
    const response = await axiosInstance.post(`/learning-service/chapters/${chapterId}/lectures`, lectureData, {
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

export const getLectureDetails = async (lectureId) => {
  try {
    const response = await axiosInstance.get(`/learning-service/lectures/${lectureId}/details`, {
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

export const deleteFileFromLecture = async (fileId, lectureId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/lectures/${lectureId}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}
