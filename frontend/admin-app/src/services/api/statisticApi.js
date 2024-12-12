import axios from 'axios'
import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_BASE_URL
export const getMonthlyNewLearnersComparison = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/learning-service/statistics/learners/monthly-comparison`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getMonthlyProblemSubmissionsComparison = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/learning-service/statistics/problems/submissions/monthly-comparison`,
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

export const getTopSolvedProblems = async (pageIndex, pageSize) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/learning-service/statistics/problems/top-solved?PageIndex=${pageIndex}&PageSize=${pageSize}`,
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

export const getMostPopularCoursesWithEnrollments = async (pageIndex, pageSize) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/learning-service/statistics/courses/most-popular?PageIndex=${pageIndex}&PageSize=${pageSize}`,
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

export const getMonthlyEnrollmentsPerCourse = async (startTime, endTime, coursePerMonth) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/learning-service/statistics/courses/enrollments/monthly?StartTime=${startTime}&EndTime=${endTime}&CoursePerMonth=${coursePerMonth}`,
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

export const GetMonthlyRevenueWithGrowth = async () => {
  try {
    const response = await axiosInstance.get('/payment-service/revenue/monthly-growth', {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const GetMonthlyCourseSalesWithGrowth = async () => {
  try {
    const response = await axiosInstance.get('/payment-service/courses/monthly-sales-growth', {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
