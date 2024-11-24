import axios from 'axios';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = 'https://localhost:5008'; // Đổi sang port của backend

export const DiscussApi = {
  getDiscussionOptions: async ({ discussionId, pageIndex, pageSize, orderBy, tags }) => {
    try {
      console.log("Fetching discussion options...", discussionId);
      const response = await axios.get(`${API_BASE_URL}/discussions/${discussionId}/options`, {
        params: {
          pageIndex,
          pageSize,
          orderBy,
          tags,
        },
      });
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error fetching discussion options:", error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },
  getCategories: async () => {
    try {
      console.log("Fetching categories...");
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },
  getDiscussionDetails: async (discussionId) => {
    try {
      console.log("Fetching discussion details for ID:", discussionId);
      const response = await axios.get(`${API_BASE_URL}/discussion/${discussionId}/details`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error fetching discussion details:", error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },
};
