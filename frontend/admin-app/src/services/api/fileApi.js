import axiosInstance from '@/lib/axios'
import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_BASE_URL
// Method to create a file

export const createFile = async (fileData, lectureId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/learning-service/lectures/${lectureId}/files`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Method to get a file by ID
export const getFileById = async (fileId) => {
  try {
    const response = await axiosInstance.get(`/learning-service/lectures/${fileId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
// Method to delete a file
export const deleteFile = async (fileId) => {
  try {
    const response = await axiosInstance.delete(`/learning-service/lectures/${fileId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
