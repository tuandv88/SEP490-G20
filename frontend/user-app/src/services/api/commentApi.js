import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_API_URL

export const CommentAPI = {
  getCommentLecture: async (lectureId, pageIndex, pageSize) => {
    const response = await axios.get(
      `${API_BASE_URL}/learning-service/lectures/${lectureId}/comments?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    return response.data
  },
  addComment: async (courseId, lectureId, content) => {
    const response = await axios.post(
      `${API_BASE_URL}/learning-service/courses/${courseId}/lectures/${lectureId}/comments`,
      { comment: { content } },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      }
    )
    console.log('response', response.data)
    return response.data
  },
  updateComment: async (courseId, lectureId, commentId, newContent) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/learning-service/courses/${courseId}/lectures/${lectureId}/comments/${commentId}`,
        { comment: { content: newContent } },
        {
          headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  },
  deleteComment: async (courseId, lectureId, commentId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/learning-service/courses/${courseId}/lectures/${lectureId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${Cookies.get('authToken')}` } }
      )
      return response.data
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }
}
