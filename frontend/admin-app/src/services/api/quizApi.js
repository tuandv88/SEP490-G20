import axiosInstance from '@/lib/axios'

export const createQuiz = async (quizData, lectureId) => {
  try {
    const response = await axiosInstance.post(`/learning-service/quizs?LectureId=${lectureId}`, quizData)
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}
