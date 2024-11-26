import React, { useEffect, useState } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";

function CommentList({ discussionId, refresh }) {
  const [comments, setComments] = useState([]); // Dữ liệu bình luận
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi nếu có
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
  }); // Thông tin phân trang

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const { updatedComments, pagination: newPagination } = await DiscussApi.getCommentsByDiscussionId(
          discussionId,
          pagination.pageIndex,
          pagination.pageSize
        );

        // Cập nhật danh sách bình luận và phân trang nếu dữ liệu hợp lệ
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
        setLoading(false);
      }
    };

    fetchComments();
  }, [discussionId, pagination.pageIndex, pagination.pageSize, refresh]); // Gọi lại API khi `refresh` thay đổi

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={styles.commentsTitle}>Comments</h3>

      {/* Hiển thị danh sách bình luận */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} style={styles.comment}>
            <div style={styles.commentUserContainer}>
              <img
                src={comment.urlProfilePicture || "default-avatar.png"}
                alt="User Avatar"
                style={styles.commentUserAvatar}
              />
              <p style={styles.commentUserName}>{comment.userName}</p>
            </div>
            <p style={styles.commentContent}>{comment.content}</p>
          </div>
        ))
      ) : (
        <p style={styles.noComments}>No comments available.</p>
      )}

      {/* Phân trang */}
      <div>
        <button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: Math.max(1, prev.pageIndex - 1) }))}
          disabled={pagination.pageIndex === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          {pagination.pageIndex} / {Math.ceil(pagination.totalCount / pagination.pageSize)}
        </span>
        <button
          onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          disabled={pagination.pageIndex * pagination.pageSize >= pagination.totalCount}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  commentsTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  comment: {
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    fontSize: "16px",
  },
  commentUserContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  commentUserAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #f0f0f0",
  },
  commentUserName: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#333",
  },
  commentContent: {
    fontSize: "14px",
    color: "#555",
  },
  noComments: {
    fontSize: "14px",
    color: "#999",
  },
  paginationButton: {
    padding: "8px 15px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "0 10px",
  },
};

export default CommentList;
