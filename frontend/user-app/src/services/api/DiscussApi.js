import axios from 'axios';
import Cookies from 'js-cookie';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  return {
    headers: {
      'Authorization': `Bearer ${Cookies.get('authToken')}`, // Thêm token vào header
    },
  };
};

export const DiscussApi = {
  // API: Lấy danh sách discussions và thêm urlProfilePicture
  getDiscussionOptions: async ({ discussionId, pageIndex, pageSize, orderBy, tags }) => {
    try {
      console.log("Fetching discussion options...", discussionId);

      // Gửi yêu cầu GET tới API với header Authorization
      const response = await axios.get(`${API_BASE_URL}/community-service/discussions/${discussionId}/options`, {
        params: { pageIndex, pageSize, orderBy, tags }
      });

      if (response && response.data && response.data.discussionDtos && response.data.discussionDtos.data) {
        const discussions = response.data.discussionDtos.data;

        const userIds = discussions.map(discussion => discussion.userId);
        console.log(userIds);
        const users = await fetchUsers(userIds);

        const updatedDiscussions = discussions.map(discussion => {
          const user = users.find(user => user.id === discussion.userId);
          return {
            ...discussion,
            urlProfilePicture: user ? user.urlProfilePicture : null,
            firstName: user ? user.firstName : null,
            lastName: user ? user.lastName : null
          };
        });

        const dataDiscussionDtos = response.data.discussionDtos;

        return { dataDiscussionDtos, updatedDiscussions, users };
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", response);
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API getDiscussionOptions:", error.message);
      throw error;
    }
  },

  // API: Lấy danh sách các categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community-service/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // API: Lấy chi tiết một discussion và thêm urlProfilePicture
  getDiscussionDetails: async (discussionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community-service/discussion/${discussionId}`);

      if (response && response.data) {
        const discussion = response.data.discussionDto;
        const userIds = [discussion.userId];
        const users = await fetchUsers(userIds);

        const user = users.find(user => user.id === discussion.userId);
        if (user) {
          discussion.urlProfilePicture = user.urlProfilePicture;
          discussion.userName = user.userName;
          discussion.firstName = user.firstName;
          discussion.lastName = user.lastName;
        }

        console.log(discussion, 12345)
        return discussion;
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", response);
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API getDiscussionDetails:", error.message);
      throw error;
    }
  },

  // API: Tạo mới một discussion
  createDiscuss: async (discussionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/discussions`, discussionData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  },

  // API: Tạo comment mới
  createComment: async ({ discussionId, content, dateCreated, parentCommentId, depth, isActive }) => {
    try {

      const commentData = { discussionId, content, dateCreated, parentCommentId, depth, isActive };
      // Gửi yêu cầu POST để tạo comment mới
      const response = await axios.post(`${API_BASE_URL}/community-service/comments`, commentData, getAuthHeaders());
      // Trả về dữ liệu comment mới

      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error.message);
      throw error;
    }
  },

  getCommentsByDiscussionId: async (discussionId, pageIndex, pageSize) => {
    try {
      // Gọi API để lấy danh sách bình luận
      const response = await axios.get(`${API_BASE_URL}/community-service/discussions/${discussionId}/comments`, {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      });

      console.log("API Response:", response); // Xem dữ liệu trả về từ API

      // Kiểm tra và xử lý dữ liệu trả về
      if (response && response.data && response.data.commentDtos) {
        const comments = response.data.commentDtos.data;
        const pagination = {
          pageIndex: response.data.commentDtos.pageIndex,
          pageSize: response.data.commentDtos.pageSize,
          totalCount: response.data.commentDtos.count,
        };

        // Lấy danh sách userId từ các bình luận
        const commentUserIds = comments.map(comment => comment.userId);

        // Fetch thông tin người dùng cho tất cả các comment
        const users = await fetchUsers(commentUserIds);

        // Cập nhật thông tin người dùng cho từng bình luận
        const updatedComments = comments.map(comment => {
          const commentUser = users.find(user => user.id === comment.userId);
          return {
            ...comment,
            userName: commentUser ? commentUser.userName : "Unknown",
            urlProfilePicture: commentUser ? commentUser.urlProfilePicture : "default-avatar.png",
          };
        });
        // Trả về danh sách bình luận đã được cập nhật và thông tin phân trang

        console.log(updatedComments, 54321);
        console.log(pagination, 53211);

        return { updatedComments, pagination };
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", response);
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API getCommentsByDiscussionId:", error.message);
      throw error;
    }
  },

};

// API thứ hai: Lấy thông tin chi tiết của UserIds
async function fetchUsers(userIds) {
  try {
    const response = await axios.post(`https://localhost:6005/users/getusers`, { UserIds: userIds });
    if (response && response.data) {
      return response.data;
    } else {
      console.error("Dữ liệu trả về từ API users không hợp lệ.");
      throw new Error("Dữ liệu trả về từ API users không hợp lệ.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API users:", error.message);
    throw error;
  }
}
