import axios from 'axios'
import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getMonthlyNewLearnersComparison = async () => {
  try {
    const response = await axiosInstance.get('/learning-service/statistics/learners/monthly-comparison', {
      headers: {
        Authorization: Cookies.get('token')
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getMonthlyProblemSubmissionsComparison = async () => {
  try {
    const response = await axiosInstance.get('/learning-service/statistics/problems/submissions/monthly-comparison', {
      headers: {
        Authorization: Cookies.get('token')
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getTopSolvedProblems = async (pageIndex, pageSize) => {
  try {
    const response = await axiosInstance.get(
      `/learning-service/statistics/problems/top-solved?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: Cookies.get('token')
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
    const response = await axiosInstance.get(
      `/learning-service/statistics/courses/most-popular?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {
        headers: {
          Authorization: Cookies.get('token')
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
    const response = await axiosInstance.get(
      `/learning-service/statistics/courses/enrollments/monthly?StartTime=${startTime}&EndTime=${endTime}&CoursePerMonth=${coursePerMonth}`,
      {
        headers: {
          Authorization: Cookies.get('token')
        }
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
