import axios from 'axios';
import Cookies from 'js-cookie';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  console.log(Cookies.get('authToken'));
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
      console.log("Fetching discussion options...", discussionId, orderBy, tags);

      // Gửi yêu cầu GET tới API với header Authorization
      const response = await axios.get(`${API_BASE_URL}/community-service/discussions/${discussionId}/options`, {
        params: { pageIndex, pageSize, orderBy, tags }
      });

      // Kiểm tra xem có thảo luận nào không
      if (response && response.data && response.data.discussionDtos && response.data.discussionDtos.data && response.data.discussionDtos.data.length > 0) {
        const discussions = response.data.discussionDtos.data;

        // Lấy các userId từ các thảo luận
        const userIds = discussions.map(discussion => discussion.userId);

        // Gọi API fetchUsers chỉ khi có thảo luận
        const users = await fetchUsers(userIds);

        // Cập nhật thông tin người dùng cho các thảo luận
        const updatedDiscussions = discussions.map(discussion => {
          const user = users.find(user => user.id === discussion.userId);
          return {
            ...discussion,
            urlProfilePicture: user ? user.urlProfilePicture : null,
            firstName: user ? user.firstName : null,
            lastName: user ? user.lastName : null
          };
        });

        const pagination = {
          pageIndex: response.data.discussionDtos.pageIndex,
          pageSize: response.data.discussionDtos.pageSize,
          totalCount: response.data.discussionDtos.count,
        };

        return { pagination, updatedDiscussions, users };
      } else {
        // Trả về mảng dataDiscussionDtos rỗng nếu không có thảo luận
        console.log("No discussions found, returning empty data.");
        return { dataDiscussionDtos: [], updatedDiscussions: [], users: [] };
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
      console.log(discussionData, getAuthHeaders());
      const response = await axios.post(`${API_BASE_URL}/community-service/discussions`, discussionData, getAuthHeaders());
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
            firstName: commentUser ? commentUser.firstName : "Anonymous",
            lastName: commentUser ? commentUser.lastName : "xxx",
          };
        });
        // Trả về danh sách bình luận đã được cập nhật và thông tin phân trang

        return { updatedComments, pagination, totalComments: pagination.totalCount };
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", response);
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API getCommentsByDiscussionId:", error.message);
      throw error;
    }
  },

  updateViewDiscussion: async ({ discussionId }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/community-service/discussion/${discussionId}/updateview`);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error.message);
      throw error;
    }
  },

  // API: Tạo comment mới
  removeDiscussionById: async ({ discussionId }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/community-service/discussions/${discussionId}/remove`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error Remove Discussion :", error.message);
      throw error;
    }
  },

  // API: Cập nhật trạng thái thông báo
  updateStatusNotificationDiscussionById: async ({ discussionId }) => {
    try {
      console.log("Updating notification status for discussionId:", discussionId);

      // Đảm bảo URL được sử dụng đúng và hợp lệ
      const url = `${API_BASE_URL}/community-service/discussion/${discussionId}/update-status-notification`;

      // Gọi API cập nhật trạng thái thông báo
      const response = await fetch(url, {
        method: 'PUT', // Phương thức PUT
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`, // Lấy token từ cookies
          'Content-Type': 'application/json' // Header yêu cầu Content-Type
        },
        body: JSON.stringify({}) // Chuyển body là một object nếu cần thiết
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Chuyển đổi phản hồi thành JSON và trả về dữ liệu
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error Update Status Notification Discussion:", error.message);
      throw error;
    }
  }
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



