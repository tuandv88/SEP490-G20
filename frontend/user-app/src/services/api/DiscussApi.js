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
        console.log(userIds, "test2");

        // Lấy thông tin chi tiết người dùng từ API
        const users = await fetchUsers(userIds);

        console.log("Thông tin người dùng:", users);

        // Thêm urlProfilePicture vào mỗi discussion
        const updatedDiscussions = discussions.map(discussion => {
          // Tìm người dùng tương ứng với userId
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

  // API: Lấy chi tiết một discussion và thêm urlProfilePicture
  // API: Lấy chi tiết một discussion và thêm urlProfilePicture vào discussion và comments
getDiscussionDetails: async (discussionId) => {
  try {
    console.log("Fetching discussion details for ID:", discussionId);

    // Gửi yêu cầu GET tới API để lấy thông tin chi tiết của discussion
    const response = await axios.get(`${API_BASE_URL}/community-service/discussion/${discussionId}/details`);

    if (response && response.data) {
      const discussion = response.data.discussionDetailDto; // Dữ liệu của discussion
      // Lấy userId từ discussion
      const userIds = [discussion.userId];  // Chỉ có 1 userId cho một discussion

      // Lấy thông tin chi tiết của user
      const users = await fetchUsers(userIds);
      // Tìm thông tin user và thêm vào urlProfilePicture vào discussion
      const user = users.find(user => user.id === discussion.userId);
      if (user) {
        discussion.urlProfilePicture = user.urlProfilePicture; // Thêm urlProfilePicture vào discussion
        discussion.userName = user.userName; // Thêm tên người dùng vào discussion
      }

      // Lấy thông tin người dùng cho các comment
      const commentUserIds = discussion.comments.map(comment => comment.userId);
      const commentUsers = await fetchUsers(commentUserIds);

      // Thêm thông tin người dùng vào từng comment
      const updatedComments = discussion.comments.map(comment => {
        const commentUser = commentUsers.find(user => user.id === comment.userId);
        return {
          ...comment,
          userName: commentUser ? commentUser.userName : "Unknown",
          urlProfilePicture: commentUser ? commentUser.urlProfilePicture : "default-avatar.png",
        };
      });

      // Cập nhật lại comments với thông tin người dùng
      discussion.comments = updatedComments;

      console.log(discussion, "discussion with comments and user info");

      return discussion; // Trả về dữ liệu đã được thêm urlProfilePicture cho cả discussion và comment
    } else {
      console.error("Dữ liệu trả về không hợp lệ:", response);
      throw new Error("Dữ liệu trả về không hợp lệ từ API.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getDiscussionDetails:", error.message);
    throw error;  // Ném lỗi để xử lý ở nơi sử dụng hàm
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
  createComment: async ({ discussionId, content, dateCreated, parentCommentId, depth, isActive }) => {
    try {
      console.log("Creating new comment with data:", { discussionId, content, dateCreated, parentCommentId, depth, isActive });

      const commentData = {
        discussionId,
        content,
        dateCreated,
        parentCommentId,
        depth,
        isActive,
      };

      // Gửi yêu cầu POST để tạo comment mới
      const response = await axios.post(`${API_BASE_URL}/community-service/comments`, commentData);

      // Trả về dữ liệu comment mới
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error.message);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng hàm
    }
  },
};

// API thứ hai: Lấy thông tin chi tiết của UserIds
async function fetchUsers(userIds) {
  console.log(userIds,123);
  try {
    const response = await axios.post(`https://localhost:6005/users/getusers`, {
      UserIds: userIds,  // Gửi mảng userIds trong đối tượng
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
