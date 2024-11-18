import axiosInstance from '@/lib/axios'

export const createChapter = async (chapterData) => {
  try {
    const response = await axiosInstance.post(
      '/learning-service/courses/2ec920eb-34f2-4dad-b075-2a3a6d067cc0/chapters',
      chapterData
    )
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}
