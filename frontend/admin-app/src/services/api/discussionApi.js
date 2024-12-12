import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getAllDiscussions = async () => {
  try {
    const response = await axiosInstance.get('/community-service/discussions/all', {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data.discussionDetailUserDtos.data
  } catch (error) {
    console.error('Error fetching discussions:', error)
    throw error
  }
}

export const updateDiscussionStatus = async (discussionId) => {
  try {
    const response = await axiosInstance.put(
      `/community-service/discussions/${discussionId}/update-status-active`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating discussion status:', error)
    throw error
  }
}

export const deleteDiscussion = async (discussionId) => {
  try {
    const response = await axiosInstance.delete(`/community-service/discussions/${discussionId}/remove`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting discussion:', error)
    throw error
  }
}
