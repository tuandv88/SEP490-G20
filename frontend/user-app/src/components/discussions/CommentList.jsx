import React, { useEffect, useState } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function CommentList({ discussionId, refresh }) {
  const [transitioning, setTransitioning] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3,
    totalCount: 0,
  });

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const { updatedComments, pagination: newPagination } =
          await DiscussApi.getCommentsByDiscussionId(
            discussionId,
            pagination.pageIndex,
            pagination.pageSize
          );

        if (updatedComments && newPagination) {
          setComments(updatedComments);
          setPagination(newPagination);
        } else {
          throw new Error("Invalid comments or pagination data.");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setTimeout(() => {
          setLoading(false);
          setTransitioning(true);
        }, 200);
      }
    };

    fetchComments();
  }, [discussionId, pagination.pageIndex, pagination.pageSize, refresh]);

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: value,
    }));
  };

  return (
    <div className="comment-list">
      {/* Loader */}
      {(loading || !transitioning) && (
        <div className="comment-list__loader-wrapper">
          <div className="comment-list__loader"></div>
        </div>
      )}

      {/* Error */}
      {loading && error && (
        <div className="comment-list__error-wrapper">
          <p className="comment-list__error-message">{error}</p>
        </div>
      )}

      {/* Comments */}
      {!loading && transitioning && !error && (
        <div className="comment-list__content">
          {/* Header */}
          <div className="comment-list__header">
            <h3 className="comment-list__title">Comments</h3>
          </div>

          {/* Body */}
          <div className="comment-list__body">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-list__item">
                  <div className="comment-list__item-header">
                    <img
                      src={comment.urlProfilePicture || "default-avatar.png"}
                      alt="User Avatar"
                      className="comment-list__avatar"
                    />
                    <p className="comment-list__username">{comment.userName}</p>
                  </div>
                  <p className="comment-list__content">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="comment-list__no-comments">
                <p>No comments available.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="comment-list__pagination">
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(pagination.totalCount / pagination.pageSize)}
                page={pagination.pageIndex}
                onChange={handlePageChange}
                shape="rounded"
                variant="outlined"
                className="pagination-buttons" // Thêm class này để dễ dàng định dạng
              />
            </Stack>
          </div>
        </div>
      )}

      <style jsx>{`
        .comment-list {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .comment-list__error-wrapper {
          text-align: center;
          margin-top: 20px;
        }

        .comment-list__loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
        }

        .comment-list__loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1e334a;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .comment-list__error-message {
          font-size: 16px;
          color: red;
        }

        .comment-list__content {
          margin-top: 20px;
        }

        .comment-list__header {
          margin-bottom: 20px;
        }

        .comment-list__title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .comment-list__body {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .comment-list__item {
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
        }

        .comment-list__item-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .comment-list__avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .comment-list__username {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .comment-list__content {
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }

        .comment-list__no-comments {
          font-size: 14px;
          color: #777;
          text-align: center;
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
      `}</style>
    </div>
  );
}

export default CommentList;
