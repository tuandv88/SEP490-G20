import axiosInstance from '@/lib/axios'

export const getCourses = async (pageIndex, pageSize) => {
  try {
    const response = await axiosInstance.get('/learning-service/courses', {
      params: { pageIndex, pageSize }
    })
    console.log('API Response:', response.data)
    return response.data.courseDtos.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/learning-service/courses', courseData)
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

export const getCourseDetails = async () => {
  try {
    const response = await axiosInstance.get(`/learning-service/courses/2ec920eb-34f2-4dad-b075-2a3a6d067cc0/details`)
    return response.data
  } catch (error) {
    console.error('Error fetching course details:', error)
    throw error
  }
}
