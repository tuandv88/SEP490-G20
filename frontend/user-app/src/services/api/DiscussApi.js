import axios from 'axios';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const DiscussApi = {
  
  // API: Lấy danh sách discussions và thêm urlProfilePicture
  getDiscussionOptions: async ({ discussionId, pageIndex, pageSize, orderBy, tags }) => {
    try {
      console.log("Fetching discussion options...", discussionId);
      
      // Gửi yêu cầu GET tới API
      const response = await axios.get(`${API_BASE_URL}/community-service/discussions/${discussionId}/options`, {
        params: {
          pageIndex,
          pageSize,
          orderBy,
          tags,
        },
      });

      console.log(response, "test1");

      // Kiểm tra dữ liệu trả về
      if (response && response.data && response.data.discussionDtos && response.data.discussionDtos.data) {
        const discussions = response.data.discussionDtos.data;
        
        // Trích xuất danh sách userId từ các discussions
        const userIds = discussions.map(discussion => discussion.userId);
        
        // Lấy thông tin chi tiết người dùng từ API
        const users = await fetchUsers(userIds);

        console.log("Thông tin người dùng:", users);

        // Thêm urlProfilePicture vào mỗi discussion
        const updatedDiscussions = discussions.map(discussion => {
          const user = users.find(user => user.id === discussion.userId);
          return {
            ...discussion,
            urlProfilePicture: user ? user.urlProfilePicture : null, // Thêm urlProfilePicture vào discussion
          };
        });

        return { updatedDiscussions, users }; // Trả về cả discussions và thông tin người dùng
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", response);
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API getDiscussionOptions:", error.message);
      throw error;  // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },

  // API: Lấy danh sách các categories
  getCategories: async () => {
    try {
      console.log("Fetching categories...");
      const response = await axios.get(`${API_BASE_URL}/community-service/categories`);
      console.log(response, "test");
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },

  // API: Lấy chi tiết một discussion
  getDiscussionDetails: async (discussionId) => {
    try {
      console.log("Fetching discussion details for ID:", discussionId);
      const response = await axios.get(`${API_BASE_URL}/community-service/discussion/${discussionId}/details`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error fetching discussion details:", error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },

  // API: Tạo mới một discussion
  createDiscuss: async (discussionData) => {
    try {
      console.log("Creating new discussion with data:", discussionData);
      const response = await axios.post(`${API_BASE_URL}/discussions`, discussionData);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },
};

// API thứ hai: Lấy thông tin chi tiết của UserIds
async function fetchUsers(userIds) {
  try {
    const response = await axios.post(`https://localhost:6005/users/getusers`, {
      UserIds: userIds,
    });

    if (response && response.data) {
      return response.data; // Trả về dữ liệu người dùng
    } else {
      console.error("Dữ liệu trả về từ API users không hợp lệ.");
      throw new Error("Dữ liệu trả về từ API users không hợp lệ.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API users:", error.message);
    throw error;
  }
}
