import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { DiscussApi } from "@/services/api/DiscussApi";

function PostList({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0); // Tổng số bài viết
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số bài viết
  const [orderBy, setOrderBy] = useState("hot");
  const [tags, setTags] = useState("");

  const navigate = useNavigate();
  const pageSize = 1;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await DiscussApi.getDiscussionOptions({
          discussionId: categoryId,
          pageIndex,
          pageSize,
          orderBy,
          tags,
        });
        if (data && data.updatedDiscussions) {
          setPosts(data.updatedDiscussions);
          setTotalCount(data.dataDiscussionDtos.count);
          setTotalPages(Math.ceil(data.dataDiscussionDtos.count / pageSize)); // Tính tổng số trang

        }

        console.log(data.dataDiscussionDtos);
        console.log(totalCount);
        console.log(totalPages);

      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchPosts();
    }
  }, [categoryId, pageIndex, orderBy, tags]);

  const handlePostClick = (postId) => {
    navigate(`/discussion/${postId}`);
  };

  const handleTagClick = (tag) => {
    setTags(tag);
  };

  const handleFilterClick = (filter) => {
    setOrderBy(filter);
    setPageIndex(1);
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
            <div
              key={post.id}
              className="post-item"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="post-content">
                <div className="post-header">
                  {/* Avatar Image of User */}
                  <img
                    src={post.urlProfilePicture || "default-avatar.png"}
                    alt={post.userName}
                    className="user-avatar"
                  />
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-tags">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="tag"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="post-meta">
                  <strong>{post.userName}</strong>
                  <p className="post-info">
                    Created at: {formatDate(post.dateCreated)}
                    <span> | </span>
                    Update at: {formatDate(post.dateUpdated)}
                  </p>
                </div>
              </div>
              <div className="post-stats">
                <span className="stat">
                  <FontAwesomeIcon icon={faChevronUp} className="icon" /> {post.voteCount}
                </span>
                <span className="stat">
                  <FontAwesomeIcon icon={faEye} className="icon" /> {post.viewCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="pagination">
          {/* Nút Previous */}
          <button
            className={`page-item ${pageIndex === 1 ? "disabled" : ""}`}
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 1}
          >
            &lt;
          </button>

          {/* Hiển thị số trang */}
          {totalPages <= 5
            ? // Nếu tổng số trang <= 5, hiển thị tất cả các trang
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-item ${pageIndex === page ? "active" : ""}`}
                onClick={() => setPageIndex(page)}
              >
                {page}
              </button>
            ))
            : // Nếu tổng số trang > 5, hiển thị giới hạn
            [
              // Trang đầu tiên
              1,
              // Hiển thị dấu "..." nếu không phải trang đầu và trang gần nhất
              ...(pageIndex > 3 ? ["..."] : []),
              // Hiển thị các trang xung quanh trang hiện tại
              ...Array.from(
                { length: Math.min(5, totalPages - 1) },
                (_, i) => Math.max(2, Math.min(totalPages - 1, pageIndex - 2 + i))
              ),
              // Trang cuối cùng nếu có đủ số trang
              ...(pageIndex < totalPages - 2 ? ["..."] : []),
              totalPages,
            ].map((page, idx) => (
              <button
                key={idx}
                className={`page-item ${pageIndex === page ? "active" : ""}`}
                onClick={() => setPageIndex(page)}
              >
                {page}
              </button>
            ))}

          {/* Nút Next */}
          <button
            className={`page-item ${pageIndex === totalPages ? "disabled" : ""}`}
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
      <style jsx>{`
  /* Container chính của PostList */
  .post-list-container {
    margin: 20px auto;
    width: 100%;
    max-width: 1200px;
    font-family: "Helvetica Neue", Arial, sans-serif;
    padding: 20px;
    border-radius: 10px; /* Bo góc */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
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
  .posts {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .post-item {
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #ffffff;
    transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .post-item:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px); /* Nhấn nổi */
  }

  .post-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .post-title {
    font-size: 16px;
    font-weight: bold;
    color: #1e334a;
  }

  .post-tags {
    display: flex;
    gap: 8px;
  }

  .tag {
    background-color: #f1f5f9;
    color: #007bff;
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }

  .tag:hover {
    background-color: #e0e7ff;
  }

  .post-meta {
    font-size: 12px;
    color: #6b7280;
  }

  .post-stats {
    display: flex;
    gap: 15px;
    font-size: 14px;
    color: #6b7280;
    align-items: center;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .icon {
    font-size: 16px;
    color: #6b7280;
  }

  .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-item {
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.page-item:hover {
  background-color: #007bff;
  color: #fff;
}

.page-item.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.page-item.disabled {
  cursor: not-allowed;
  background-color: #f8f9fa;
  color: #adb5bd;
}

.page-item.disabled:hover {
  background-color: #f8f9fa;
  color: #adb5bd;
}

.dots {
  margin: 0 10px;
  font-size: 16px;
  color: #6c757d;
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
