import axios from 'axios';
import Cookies from 'js-cookie';

// Sửa API base URL cho đúng với backend
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_AUTHEN_URL = import.meta.env.VITE_AUTH_URL;

// Hàm lấy header xác thực
const getAuthHeaders = () => {
    return {
        headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`, // Thêm token vào header
        },
    };
};

export const NotificationApi = {

    // API lấy lịch sử thông báo của người dùng
    getNotificationHistoriesByIdUserCurrent: async ({ pageIndex, pageSize }) => {
        try {
            // Gửi yêu cầu GET tới API với header Authorization
            const response = await axios.get(`${API_BASE_URL}/community-service/notificationhistories/detail`, {
                params: { pageIndex, pageSize },
                ...getAuthHeaders()  // Thêm header xác thực vào yêu cầu
            });

            // Kiểm tra xem có thông báo nào không
            if (response && response.data && response.data.notificationHistoryDetailDtos && response.data.notificationHistoryDetailDtos.data && response.data.notificationHistoryDetailDtos.data.length > 0) {
                const notificationHistories = response.data.notificationHistoryDetailDtos.data;

                // Lấy các senderId từ các thông báo, chỉ lấy nếu senderId không null
                const senderIds = notificationHistories
                    .filter(notification => notification.senderId)  // Lọc ra các notification có senderId
                    .map(notification => notification.senderId);

                // Gọi API fetchUsers chỉ khi có senderIds
                const users = senderIds.length > 0 ? await fetchUsers(senderIds) : [];

                // Cập nhật thông tin người gửi và thông tin loại thông báo cho các thông báo
                const updatedNotificationHistories = notificationHistories.map(notification => {
                    // Lấy thông tin người gửi nếu có senderId
                    const sender = users.find(user => user.id === notification.senderId);

                    // Kiểm tra nếu sender không tồn tại, mặc định là null hoặc dữ liệu trống
                    const senderProfile = sender ? {
                        urlProfilePicture: sender.urlProfilePicture || null, // Nếu không có ảnh, gán null
                        firstName: sender.firstName || null,                 // Nếu không có tên, gán null
                        lastName: sender.lastName || null                    // Nếu không có họ, gán null
                    } : {
                        urlProfilePicture: null, // Không có thông tin người gửi
                        firstName: null,
                        lastName: null
                    };

                    // Cập nhật thông tin loại thông báo
                    const notificationType = notification.notificationTypeDto ? {
                        id: notification.notificationTypeDto.id,
                        name: notification.notificationTypeDto.name,
                        description: notification.notificationTypeDto.description,
                        canSendEmail: notification.notificationTypeDto.canSendEmail,
                        canSendWebsite: notification.notificationTypeDto.canSendWebsite,
                        priority: notification.notificationTypeDto.priority
                    } : null;

                    return {
                        ...notification,
                        ...senderProfile,  // Thêm thông tin người gửi vào thông báo
                        notificationType // Thêm thông tin loại thông báo vào thông báo
                    };
                });

                const pagination = {
                    pageIndex: response.data.notificationHistoryDetailDtos.pageIndex,
                    pageSize: response.data.notificationHistoryDetailDtos.pageSize,
                    totalCount: response.data.notificationHistoryDetailDtos.count,
                };

                return { pagination, updatedNotificationHistories, users };
            } else {
                // Trả về mảng data rỗng nếu không có thông báo
                return { notificationHistoryDtos: [], updatedNotificationHistories: [], users: [] };
            }
        } catch (error) {
            console.error("Lỗi khi gọi API getNotificationHistories:", error.message);
            throw error;
        }
    }
};

// API thứ hai: Lấy thông tin chi tiết của UserIds
async function fetchUsers(userIds) {
    try {
        // Gửi yêu cầu API với danh sách senderIds và thêm header xác thực
        const response = await axios.post(`${API_AUTHEN_URL}/users/getusers`, { UserIds: userIds }, getAuthHeaders());

        // Kiểm tra xem dữ liệu có hợp lệ hay không
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
            return response.data; // Trả về danh sách người dùng
        } else {
            console.error("Không tìm thấy người dùng hoặc dữ liệu không hợp lệ.");
            // Trả về mảng trống nếu không có người dùng
            return [];
        }
    } catch (error) {
        // Xử lý lỗi API hoặc lỗi mạng
        console.error("Lỗi khi gọi API users:", error.message);
        // Bạn có thể trả về giá trị mặc định khi gặp lỗi
        return []; // Dữ liệu trống trong trường hợp có lỗi
    }
}
