import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack, faEye, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from 'date-fns';
import { DiscussApi } from "@/services/api/DiscussApi";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function PostList({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số bài viết
  const [orderBy, setOrderBy] = useState("hot");
  const [tags, setTags] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await DiscussApi.getDiscussionOptions({
          discussionId: categoryId,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          orderBy,
          tags,
        });

        if (data && data.updatedDiscussions) {
          setPosts(data.updatedDiscussions);
          setPagination(data.pagination);
          setTotalPages(Math.ceil(data.pagination.totalCount / pagination.pageSize)); // Tính tổng số trang
        }

      } catch (err) {
        setError("Failed to fetch posts");
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchPosts();
    }
  }, [categoryId, pagination.pageIndex, orderBy, tags]);

  const handlePostClick = (postId) => {
    navigate(`/discussion/${postId}`);
  };

  const handleTagClick = (tag) => {
    setTags(tag);
  };

  const handleFilterClick = (filter) => {
    setOrderBy(filter);
    handlePageChange(1);
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm định dạng thời gian, sử dụng formatDate nếu vượt quá 7 ngày
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Tính số ngày đã qua kể từ ngày đăng
    const diffInTime = now - date;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    if (diffInDays >= 7) {
      // Nếu đã qua 1 tuần, hiển thị theo định dạng ngày giờ đầy đủ
      return formatDate(dateString);
    }

    // Nếu chưa qua 7 ngày, sử dụng formatDistanceToNow để hiển thị "x minutes ago", "x days ago", v.v.
    const distance = formatDistanceToNow(date, { addSuffix: true });

    return distance;
  };

  return (
    <div className="post-list-container">
      {/* Filters Section */}
      <div className="filters">
        <div className="filter-options">
          <span
            className={`filter-button ${orderBy === "hot" ? "active" : ""}`}
            onClick={() => handleFilterClick("hot")}
          >
            Hot
          </span>
          <span
            className={`filter-button ${orderBy === "newest" ? "active" : ""}`}
            onClick={() => handleFilterClick("newest")}
          >
            Newest
          </span>
          <span
            className={`filter-button ${orderBy === "mostvotes" ? "active" : ""}`}
            onClick={() => handleFilterClick("mostvotes")}
          >
            Most Votes
          </span>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search Tag"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="search-input"
          />

          <button className="new-button" onClick={() => navigate("/createpost")}>
            New +
          </button>
        </div>
      </div>

      {/* Posts Section */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {!loading && posts.length === 0 && <p>No posts available.</p>}

      {!loading && (
        <div className="posts">
          {posts.map((post) => (
            <div key={post.id} className="post-item" onClick={() => handlePostClick(post.id)}>
              {/* Header */}
              <div className="post-header">
                <div className="post-header-left">
                  {/* Avatar */}
                  <img
                    src={post.urlProfilePicture || "default-avatar.png"}
                    alt="User Avatar"
                    className="user-avatar"
                  />

                  {/* Title */}
                  <div>
                    <h3 className="post-title">
                      {post.pinned && (
                        <FontAwesomeIcon icon={faThumbtack} className="icon pin-icon" />
                      )}
                      {post.title}
                    </h3>
                    <div className="post-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="tag" onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Meta and Stats */}
              <div className="post-footer">
                {/* Meta */}
                <div className="post-meta">
                  <strong>{post.firstName} {post.lastName}</strong>
                  <p>Created at: {formatRelativeDate(post.dateCreated)} | Updated at: {formatRelativeDate(post.dateUpdated)}</p>
                </div>

                {/* Stats */}
                <div className="post-stats">
                  <span className="stat">
                    <FontAwesomeIcon icon={faChevronUp} className="icon" /> {post.voteCount}
                  </span>
                  <span className="stat">
                    <FontAwesomeIcon icon={faEye} className="icon" /> {post.viewCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}

      {!loading && totalPages > 0 && (
        <div className="comment-list__pagination">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={pagination.pageIndex}
              onChange={handlePageChange}
              shape="rounded"
              variant="outlined"
              className="pagination-buttons" // Thêm class này để dễ dàng định dạng
            />
          </Stack>
        </div>
      )}

      <style jsx>{`
  /* Container chính của PostList */
  .post-list-container {
    margin: 20px auto;
    width: 100%;
    max-width: 1200px;
    font-family: "Helvetica Neue", Arial, sans-serif;
    padding: 15px;
    border-radius: 10px; /* Bo góc */
    background: #f9f9f9;
  }

  /* Khu vực filter và tìm kiếm */
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    background: #ffffff; /* Nền trắng */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng */
  }

  .filter-options {
    display: flex;
    gap: 10px;
  }

  .filter-button {
  flex: 1; /* Các nút sẽ tự động chiếm không gian đều nhau */
  text-align: center; /* Đảm bảo chữ luôn căn giữa */
  display: flex;
  align-items: center; /* Căn giữa nội dung trong nút */
  justify-content: center; /* Căn giữa nội dung trong nút */
  max-width: 120px; /* Giới hạn kích thước tối đa của nút (giảm lại) */
  min-width: 100px; /* Đảm bảo kích thước nút không nhỏ hơn */
  padding: 10px; /* Giảm padding để nút nhỏ gọn hơn */
  font-size: 12px; /* Font chữ nhỏ hơn */
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  color: #1e334a; /* Màu xanh than nhạt */
  border: 1px solid #e0e0e0; /* Viền mỏng tinh tế */
  background: #f9f9f9; /* Màu nền trắng */
  border-radius: 8px; /* Bo góc cho nút */
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1); /* Giảm độ lớn đổ bóng */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative; /* Hiệu ứng ánh sáng cần position */
  overflow: hidden;
}

/* Hiệu ứng hover */
.filter-button:hover {
  color: #14212b; /* Màu xanh đậm hơn khi hover */
  background: rgba(30, 51, 74, 0.1); /* Nền xanh nhạt khi hover */
  border-color: #b0b0b0; /* Viền đậm hơn khi hover */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ khi hover */
}

/* Nút đang active */
.filter-button.active {
  color: #ffffff; /* Chữ trắng */
  background: linear-gradient(45deg, #374151, #1e334a); /* Gradient nền xanh than đậm */
  font-weight: bold; /* Tăng đậm chữ */
  border-color: #374151; /* Viền đậm khi active */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn */
  transform: scale(1.03); /* Phóng to nhẹ khi active */
}

/* Hiệu ứng ánh sáng di chuyển qua tab */
.filter-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-45deg);
  transition: left 0.3s ease-in-out;
}

.filter-button:hover::before {
  left: 100%; /* Ánh sáng trượt qua tab khi hover */
}
  
.new-button {
  text-align: center; /* Đảm bảo chữ luôn căn giữa */
  display: flex;
  align-items: center; /* Căn giữa nội dung theo chiều dọc */
  justify-content: center; /* Căn giữa nội dung theo chiều ngang */
  max-width: 150px; /* Giới hạn kích thước tối đa */
  min-width: 120px; /* Giới hạn kích thước tối thiểu */
  padding: 12px 16px; /* Kích thước nút vừa phải */
  font-size: 14px; /* Font chữ lớn hơn để nhấn mạnh */
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: bold; /* Font chữ đậm để nổi bật */
  color: #ffffff; /* Màu chữ trắng */
  border: none; /* Loại bỏ viền */
  background: #1e334a; /* Nền màu xanh than đậm */
  border-radius: 8px; /* Bo góc vừa phải */
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn để tạo chiều sâu */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative; /* Hiệu ứng ánh sáng cần position */
  overflow: hidden;
}

/* Hiệu ứng hover */
.new-button:hover {
  background: #14212b; /* Nền tối hơn khi hover */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); /* Đổ bóng mạnh hơn khi hover */
  transform: translateY(-2px); /* Nhấn nổi */
}

/* Nút đang active */
.new-button:active {
  transform: translateY(0); /* Không nổi khi active */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng nhẹ hơn */
}

/* Hiệu ứng ánh sáng di chuyển qua nút */
.new-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -25%;
  width: 150%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  transform: skewX(-45deg);
  transition: left 0.3s ease-in-out;
}

.new-button:hover::before {
  left: 100%; /* Ánh sáng trượt qua nút khi hover */
}

/* Khi nút bị disabled */
.new-button.disabled {
  background: #9ca3af; /* Màu xám nhạt */
  color: #e5e7eb; /* Chữ xám nhạt */
  cursor: not-allowed; /* Không cho phép click */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

  .search-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-input {
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    background: #ffffff;
    flex: 1; /* Giãn tìm kiếm theo chiều ngang */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  }


/* Danh sách bài viết */
/* Từng bài viết */
.post-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px; /* Khoảng cách với nội dung ở trên */
  padding: 20px 25px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.post-item:hover {
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

/* Header bài viết */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-header-left {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* Avatar */
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #eef2ff;
}

/* Tiêu đề */
.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pin-icon {
  color: #2563eb;
  font-size: 18px;
}

/* Tags */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  padding: 4px 10px;
  font-size: 12px;
  color: #1e334a;
  background-color: #eef2ff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.tag:hover {
  background-color: #dbeafe;
  color: #1d4ed8;
}

/* Metadata và Stats cùng dòng */
/* Footer (Meta và Stats) */
.post-footer {
  display: flex;
  justify-content: space-between; /* Căn các phần tử về hai đầu */
  align-items: center;
  margin-top: 8px; /* Khoảng cách với nội dung ở trên */
  width: 100%; /* Đảm bảo chiều rộng đầy đủ */
}

/* Metadata */
.post-meta {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  gap: 10px; /* Khoảng cách giữa các metadata */
  align-items: center;
}

.post-meta strong {
  font-weight: 600;
  color: #1e334a;
}

/* Stats */
.post-stats {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #64748b;
  align-items: center;
}

/* Thống kê (Icon và số liệu) */
.stat {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon {
  font-size: 16px;
  color: #1e334a;
}


/* Hiệu ứng hover tiêu đề */
.post-item:hover .post-title {
  color: #2563eb;
}

/* Căn giữa phần pagination */
.comment-list__pagination {
  display: flex;
  justify-content: center; /* Căn giữa các phần tử theo chiều ngang */
  align-items: center; /* Căn giữa theo chiều dọc */
  width: 100%; /* Đảm bảo phần pagination chiếm toàn bộ chiều rộng */
  margin-top: 30px; /* Tùy chọn thêm khoảng cách phía trên */
}

/* Nút pagination không được chọn */
.comment-list__pagination .MuiPaginationItem-root {
  text-align: center;
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  max-width: 45px; /* Kích thước tối đa nhỏ hơn */
  min-width: 35px;  /* Kích thước tối thiểu nhỏ hơn */
  padding: 6px 10px; /* Kích thước nút nhỏ hơn */
  font-size: 10px;   /* Font chữ nhỏ hơn */
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: bold;
  color: #14212b;    /* Màu chữ khi nút không được chọn */
  background: #ffffff;  /* Màu nền nút không được chọn */
  border-radius: 8px; /* Bo tròn nhẹ cho nút */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

/* Hiệu ứng hover cho pagination item */
.comment-list__pagination .MuiPaginationItem-root:hover {
  background: #14212b; /* Màu nền khi hover (màu tối) */
  color: #ffffff;  /* Màu chữ khi hover */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px); /* Nhấn nổi nhẹ khi hover */
}

/* Nút đang active (chọn) */
.comment-list__pagination .MuiPaginationItem-root.Mui-selected {
  background: #14212b; /* Màu nền khi nút được chọn */
  color: #ffffff; /* Màu chữ trắng khi chọn */
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(0); /* Không thay đổi vị trí khi active */
}

/* Hiệu ứng ánh sáng cho pagination */
.comment-list__pagination .MuiPaginationItem-root::before {
  content: "";
  position: absolute;
  top: 0;
  left: -25%;
  width: 150%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  transform: skewX(-45deg);
  transition: left 0.3s ease-in-out;
}

.comment-list__pagination .MuiPaginationItem-root:hover::before {
  left: 100%;
}

/* Khi pagination bị disabled */
.comment-list__pagination .MuiPaginationItem-root.Mui-disabled {
  background: #9ca3af;
  color: #e5e7eb;
  cursor: not-allowed;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

    .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px; /* Chiều cao loader */
  }

  .loader {
    border: 4px solid #f3f3f3; /* Màu viền ngoài */
    border-top: 4px solid #1e334a; /* Màu viền trên */
    border-radius: 50%; /* Tạo hình tròn */
    width: 30px; /* Đường kính loader */
    height: 30px; /* Đường kính loader */
    animation: spin 1s linear infinite; /* Hiệu ứng quay */
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

`}</style>
    </div >
  );
}

export default PostList;
