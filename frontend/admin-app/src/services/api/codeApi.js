import axiosInstance from '@/lib/axios'

export const runCode = async (codeData) => {
  try {
    const response = await axiosInstance.post(
      '/learning-service/submissions/batch',
      codeData
    )
    return response.data
  } catch (error) {
    console.error('Error run code:', error)
    throw error
  }
}
