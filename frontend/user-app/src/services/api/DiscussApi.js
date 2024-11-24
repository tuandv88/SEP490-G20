import axios from 'axios';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = 'https://localhost:5008'; // Đổi sang port của backend

export const DiscussApi = {
  getDiscussionOptions: async ({ discussionId, pageIndex, pageSize, orderBy, tags }) => {
    try {
      console.log("Fetching discussion options...");
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
      console.error('Error fetching discussion options:', error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },
};
