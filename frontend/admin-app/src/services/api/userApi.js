import Cookies from 'js-cookie'
import axios from 'axios'
const API_BASE_URL_AUTH = import.meta.env.VITE_BASE_URL_AUTH
const axiosInstanceAuth = axios.create({
  baseURL: API_BASE_URL_AUTH,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})
export const getAllUsersDetail = async (signal) => {
  try {
    const token = Cookies.get('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await axiosInstanceAuth.get('/users/alldetails', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: signal // Pass signal to request
    })

    return response.data
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      throw error
    }

    if (error.response) {
      throw new Error(error.response.data.message || 'Server error')
    } else if (error.request) {
      throw new Error('No response from server')
    } else {
      throw new Error('An error occurred while sending the request')
    }
  }
}

export const getAllRoles = async () => {
  try {
    const token = Cookies.get('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }
    const response = await axiosInstanceAuth.get('/roles/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}

export const updateUserRole = async (userId, roleId) => {
  try {
    const token = Cookies.get('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }
    const response = await axiosInstanceAuth.put(
      `roles/updateroleuser`,
      {
        UserId: userId,
        RoleId: roleId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}

export const getUserById = async (userId) => {
  try {
    const token = Cookies.get('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }
    const response = await axiosInstanceAuth.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}

export const lockAccountUser = async (userId, lockoutTimeUtc) => {
  try {
    const token = Cookies.get('authToken')
    if (!token) {
      throw new Error('No authentication token found')
    }
    const response = await axiosInstanceAuth.put(
      `/users/lockaccount`,
      {
        userId: userId,
        lockoutTimeUtc: lockoutTimeUtc
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}
