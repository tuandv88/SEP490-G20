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

export const updateChapter = async (chapterData, courseId, chapterId) => {
  try {
    // Format the chapter data to match the API body structure

    const response = await axiosInstance.put(
      `/learning-service/courses/${courseId}/chapters/${chapterId}`,
      chapterData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating chapter:', error)
    throw error
  }
}

export const deleteChapter = async (courseId, chapterId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/courses/${courseId}/chapters/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting chapter:', error)
    throw error
  }
}
