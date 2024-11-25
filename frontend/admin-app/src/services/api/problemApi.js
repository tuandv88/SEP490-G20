import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const createProblem = async (problemData, lectureId) => {
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
