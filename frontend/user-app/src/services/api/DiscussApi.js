import axios from 'axios';

const API_BASE_URL = 'https://localhost:5008';

export const DiscussApi = {
  getDiscussionOptions: async ({ discussionId, pageIndex, pageSize, orderBy, tags }) => {
    try {
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
