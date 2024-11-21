import axiosInstance from '@/lib/axios'

export const createProblem = async (problemData) => {
  try {
    const response = await axiosInstance.post(
      '/learning-service/problems',
      problemData
    )
    return response.data
  } catch (error) {
    console.error('Error create problem:', error)
    throw error
  }
}
