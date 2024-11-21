import axiosInstance from '@/lib/axios'

export const createLecture = async (chapterId, lectureData) => {
  try {
    const response = await axiosInstance.post(`/learning-service/chapters/${chapterId}/lectures`, lectureData)
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}
