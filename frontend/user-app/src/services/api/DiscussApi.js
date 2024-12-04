import axios from 'axios';
import Cookies from 'js-cookie';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_AUTHEN_URL = import.meta.env.VITE_AUTH_URL;

const getAuthHeaders = () => {
  //console.log(Cookies.get('authToken'));
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
      const response = await axios.post(`${API_BASE_URL}/community-service/discussions/create`, discussionData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  },

  // API: Tạo mới một discussion
  updateDiscuss: async (discussionData) => {
    try {

      // Bọc `discussionData` vào trong đối tượng `UpdateDiscussionRequest`
      const requestBody = {
        updateDiscussionDto: discussionData
      };
      console.log(requestBody);
      const response = await fetch(`${API_BASE_URL}/community-service/discussions/update`, {
        method: 'PUT', // Phương thức PUT để cập nhật dữ liệu
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`, // Lấy token từ cookies
          'Content-Type': 'application/json' // Đảm bảo kiểu dữ liệu là JSON
        },
        body: JSON.stringify(requestBody) // Chuyển đổi đối tượng thành chuỗi JSON
      });

      if (!response.ok) {
        // Nếu response không phải là mã 2xx (thành công), ném lỗi
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // Parse dữ liệu trả về dưới dạng JSON
      return data; // Trả về dữ liệu nhận được từ API
    } catch (error) {
      console.error("Error updating discussion:", error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm này
    }
  },

  // API: Cập nhật hình ảnh cho một discussion
  updateDiscussImage: async (idDiscussion, discussionImageData) => {
    try {
      // Bọc `discussionImageData` vào trong đối tượng `UpdateDiscussionRequest`
      const requestBody = {
        id: idDiscussion,  // ID của discussion cần cập nhật
        imageDto: discussionImageData // Dữ liệu hình ảnh
      };

      console.log(requestBody);  // Kiểm tra request body

      // Gửi yêu cầu PUT để cập nhật hình ảnh
      const response = await fetch(`${API_BASE_URL}/community-service/discussions/updateimage`, {
        method: 'PUT', // Phương thức PUT để cập nhật dữ liệu
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`, // Lấy token từ cookies
          'Content-Type': 'application/json' // Đảm bảo kiểu dữ liệu là JSON
        },
        body: JSON.stringify(requestBody) // Chuyển đối tượng thành chuỗi JSON
      });

      if (!response.ok) {
        // Nếu response không phải là mã 2xx (thành công), ném lỗi
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // Parse dữ liệu trả về dưới dạng JSON
      return data; // Trả về dữ liệu nhận được từ API
    } catch (error) {
      console.error("Error updating discussion:", error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm này
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

  // API: Edit comment mới
  updateComment: async ({ updateCommentData }) => {
    try {
      // Bọc đối tượng updateCommentDto vào trong một đối tượng
      const updateCommentDto = {
        updateCommentDto: {
          id: updateCommentData.id, // Lấy id comment cần chỉnh sửa
          discussionId: updateCommentData.discussionId,  // ID của thảo luận
          content: updateCommentData.content,       // Nội dung mới của comment
          parentCommentId: updateCommentData.parentCommentId, // ID của comment cha (nếu có)
          isActive: updateCommentData.isActive,      // Trạng thái hoạt động của comment
          depth: updateCommentData.depth          // Độ sâu của comment
        }
      };

      console.log(updateCommentDto, 1111);

      // Gửi yêu cầu PUT để cập nhật comment (thay vì POST, vì bạn đang chỉnh sửa comment đã có)
      const response = await axios.put(`${API_BASE_URL}/community-service/comments/update`, updateCommentDto, getAuthHeaders());

      // Trả về dữ liệu comment đã được chỉnh sửa
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error.message);
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
      if (response && response.data && response.data.commentsDetailDtos) {
        const comments = response.data.commentsDetailDtos.data;
        const pagination = {
          pageIndex: response.data.commentsDetailDtos.pageIndex,
          pageSize: response.data.commentsDetailDtos.pageSize,
          totalCount: response.data.commentsDetailDtos.count,
        };

        // Nếu không có bình luận, trả về dữ liệu rỗng
        if (!comments || comments.length === 0) {
          return { updatedComments: [], pagination, totalComments: 0 };
        }

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
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      throw error;
    }
  },

  getCommentsByCommentParentId: async (discussionId, commentParentId, pageIndex, pageSize) => {
    try {
      // Gọi API để lấy danh sách bình luận
      const response = await axios.get(`${API_BASE_URL}/community-service/discussions/${discussionId}/${commentParentId}/comments`, {
        params: { PageIndex: pageIndex, PageSize: pageSize }
      });

      // Kiểm tra và xử lý dữ liệu trả về
      if (response && response.data && response.data.commentsDetailDtos) {
        const comments = response.data.commentsDetailDtos.data;
        const pagination = {
          pageIndex: response.data.commentsDetailDtos.pageIndex,
          pageSize: response.data.commentsDetailDtos.pageSize,
          totalCount: response.data.commentsDetailDtos.count,
        };

        // Nếu không có bình luận, trả về dữ liệu rỗng
        if (!comments || comments.length === 0) {
          return { updatedComments: [], pagination, totalComments: 0 };
        }

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
        throw new Error("Dữ liệu trả về không hợp lệ từ API.");
      }
    } catch (error) {
      throw error;
    }
  },

  // API: Remove comment mới
  removeCommentById: async ({ commentId }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/community-service/comments/${commentId}/remove`, getAuthHeaders());
      return response;
    } catch (error) {
      console.error("Error Remove Comment :", error.message);
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
      return response;
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
  },

  createVoteDiscussion: async ({ discussionId, commentId, voteType, isActive }) => {
    try {
      // Gửi yêu cầu POST tới API với header Authorization
      const response = await axios.post(
        `${API_BASE_URL}/community-service/votes/create`,
        {
          DiscussionId: discussionId,
          CommentId: commentId,
          VoteType: voteType,
          IsActive: isActive,
        },
        getAuthHeaders()  // Thêm headers với token
      );

      // Kiểm tra nếu yêu cầu thành công
      if (response && response.data) {
        //console.log('Vote created successfully:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to create vote');
      }
    } catch (error) {
      //console.error('Error creating vote:', error);
      throw error;
    }
  },

  createVoteComment: async ({ discussionId, commentId, voteType, isActive }) => {
    try {
      // Gửi yêu cầu POST tới API với header Authorization
      const response = await axios.post(
        `${API_BASE_URL}/community-service/votes/create`,
        {
          DiscussionId: discussionId,
          CommentId: commentId,
          VoteType: voteType,
          IsActive: isActive,
        },
        getAuthHeaders()  // Thêm headers với token
      );

      // Kiểm tra nếu yêu cầu thành công
      if (response && response.data) {
        //console.log('Vote created successfully:', response.data);
        return response.data;
      } else {
        throw new Error('Failed to create vote');
      }
    } catch (error) {
      //console.error('Error creating vote:', error);
      throw error;
    }
  },

  getDiscussionHome: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community-service/discussions/top`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getDiscussionsByUserId: async (pageIndex, pageSize, searchKeyword, tags) => {
    try {
      // Kiểm tra các tham số trước khi gọi API
      if (pageIndex <= 0 || pageSize <= 0) {
        throw new Error('Page index and page size must be greater than 0.');
      }

      // Kiểm tra nếu searchKeyword hoặc tags là null hoặc undefined, có thể bỏ qua
      if (searchKeyword === undefined || searchKeyword === null) {
        searchKeyword = '';
      }
      if (tags === undefined || tags === null) {
        tags = '';
      }

      // Mã hóa các tham số vào URL
      const url = `${API_BASE_URL}/community-service/discussions/byuserid?pageIndex=${pageIndex}&pageSize=${pageSize}&SearchKeyword=${encodeURIComponent(searchKeyword)}&Tags=${encodeURIComponent(tags)}`;
      console.log('Query URL:', url);

      // Gọi API với header Authorization nếu cần
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      });

      // Kiểm tra dữ liệu API trả về
      if (response && response.data) {
        // Kiểm tra xem response có chứa dữ liệu cần thiết không
        if (response.data.discussionDetailUserDtos && response.data.discussionDetailUserDtos.data) {
          console.log('Data Response: ', response.data);
          return response.data;
        } else {
          throw new Error('Invalid data structure in response');
        }
      } else {
        throw new Error('No data received from API');
      }

    } catch (error) {
      console.error('Error fetching discussions:', error.message);
      throw error;  // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
    }
  }

};

// API thứ hai: Lấy thông tin chi tiết của UserIds
async function fetchUsers(userIds) {
  try {
    // Gửi yêu cầu API với danh sách UserIds
    const response = await axios.post(`${API_AUTHEN_URL}/users/getusers`, { UserIds: userIds });

    // Kiểm tra xem dữ liệu có hợp lệ hay không
    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      //console.log("Dữ liệu người dùng:", response.data);
      return response.data; // Trả về danh sách người dùng
    } else {
      console.error("Không tìm thấy người dùng hoặc dữ liệu không hợp lệ.");
      // Trả về mảng trống hoặc một giá trị mặc định nào đó nếu không có người dùng
      return []; // Dữ liệu trống, tránh "đứng" ứng dụng
    }
  } catch (error) {
    // Xử lý lỗi API hoặc lỗi mạng
    console.error("Lỗi khi gọi API users:", error.message);
    // Bạn có thể trả về giá trị mặc định khi gặp lỗi
    return []; // Dữ liệu trống trong trường hợp có lỗi
  }
}




