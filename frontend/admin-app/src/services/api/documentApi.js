import axios from '@/lib/axios'
import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

const API_BASE_URL = import.meta.env.VITE_BASE_URL
const TIMEOUT = 15000

// Tạo instance axios với timeout
const axiosWithTimeout = axios.create({
  timeout: TIMEOUT
})

export const getDocuments = async (pageIndex, pageSize) => {
  try {
    const response = await axiosWithTimeout.get(
      `${API_BASE_URL}/ai-service/documents?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        },
        timeout: TIMEOUT
      }
    )
    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    throw error
  }
}

export const importDocumentFile = async (data) => {
  try {
    const response = await axiosWithTimeout.post(`${API_BASE_URL}/ai-service/documents/imports/files`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('authToken')}`
      },
      timeout: TIMEOUT
    })
    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    throw error
  }
}

export const importDocumentWeb = async (data) => {
  try {
    const response = await axiosWithTimeout.post(`${API_BASE_URL}/ai-service/documents/imports/webs`, data, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      },
      timeout: TIMEOUT
    })
    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    throw error
  }
}

export const importDocumentText = async (data) => {
  try {
    const response = await axiosWithTimeout.post(`${API_BASE_URL}/ai-service/documents/imports/text`, data, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      },
      timeout: TIMEOUT
    })
    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    throw error
  }
}

export const deleteDocuments = async (documentIds) => {
  if (!Array.isArray(documentIds) || documentIds.length === 0) {
    throw new Error('Invalid input: documentIds must be a non-empty array')
  }

  if (documentIds.length > 4) {
    throw new Error('Cannot delete more than 4 documents at once')
  }

  try {
    const queryString = `documentIds=${documentIds.join(',')}`
    const response = await axiosWithTimeout.delete(`${API_BASE_URL}/ai-service/documents?${queryString}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      },
      timeout: TIMEOUT
    })

    return response.data
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }
    throw error
  }
}
