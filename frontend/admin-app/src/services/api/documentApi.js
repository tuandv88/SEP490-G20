import axios from '@/lib/axios'
import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getDocuments = async (pageIndex, pageSize) => {
  try {
    const response = await axios.get(`/ai-service/documents?PageIndex=${pageIndex}&PageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
export const importDocumentFile = async (data) => {
  try {
    const response = await axios.post('/ai-service/documents/imports/files', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const importDocumentWeb = async (data) => {
  try {
    const response = await axiosInstance.post('/ai-service/documents/imports/webs', data, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const importDocumentText = async (data) => {
  try {
    const response = await axiosInstance.post('/ai-service/documents/imports/text', data, {
      headers: {
        Authorization: `Bearer ${Cookies.get('access_token')}`
      }
    })
    return response.data
  } catch (error) {
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
    const response = await axiosInstance.delete(`/ai-service/documents?${queryString}`, {
      headers: { Authorization: `Bearer ${Cookies.get('access_token')}` }
    })

    return response.data
  } catch (error) {
    throw error
  }
}
