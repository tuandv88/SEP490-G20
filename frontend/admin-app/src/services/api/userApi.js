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
export const getAllUsersDetail = async () => {
  try {
    const response = await axiosInstanceAuth.get('/users/alldetails', {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getAllRoles = async () => {
  try {
    const response = await axiosInstanceAuth.get('/roles/all', {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateUserRole = async (userId, roleId) => {
  try {
    const response = await axiosInstanceAuth.put(
      `roles/updateroleuser`,
      {
        UserId: userId,
        RoleId: roleId
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
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
    const response = await axiosInstanceAuth.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}

export const createUser = async (userData) => {
  try {
    const response = await axiosInstanceAuth.post(`/users/account/create`, userData, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}

export const lockAccountUser = async (userId, lockoutTimeUtc) => {
  try {
    const response = await axiosInstanceAuth.put(
      `/users/lockaccount`,
      {
        userId: userId,
        lockoutTimeUtc: lockoutTimeUtc
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error(error.response.data.message || 'Server error')
  }
}
