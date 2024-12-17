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
    throw error
  }
}

export const updateLecture = async (chapterId, lectureId, lectureData) => {
  try {
    const response = await axiosInstance.put(
      `/learning-service/chapters/${chapterId}/lectures/${lectureId}`,
      { lecture: lectureData },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteLecture = async (chapterId, lectureId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/chapters/${chapterId}/lectures/${lectureId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
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
    throw error
  }
}

export const updateLectureOrder = async (chapterId, lectures) => {
  try {
    const response = await axiosInstance.put(`/lectures/order/${chapterId}`, {
      lectures: lectures.map((lecture, index) => ({
        lectureId: lecture.id,
        newOrder: index + 1
      }))
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const swapLectureOrder = async (firstLectureId, secondLectureId) => {
  try {
    const response = await axiosInstance.put(
      `/learning-service/lectures/swap/${firstLectureId}/${secondLectureId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
