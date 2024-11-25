import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'
export const createChapter = async (chapterData, courseId) => {
  try {
    const response = await axiosInstance.post(`/learning-service/courses/${courseId}/chapters`, chapterData, {
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
