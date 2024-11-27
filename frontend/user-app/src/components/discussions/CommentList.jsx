import React, { useEffect, useState, useRef } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { marked } from 'marked'; // Import marked library

function CommentList({ discussionId }) {
  const [transitioning, setTransitioning] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const textAreaRef = useRef(null);
  const [newComment, setNewComment] = useState("");
  const [refreshComments, setRefreshComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [totalCommnents, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3,
    totalCount: 0,
  });

  // New state to handle the comment input
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const { updatedComments, pagination: newPagination, totalComments } =
          await DiscussApi.getCommentsByDiscussionId(
            discussionId,
            pagination.pageIndex,
            pagination.pageSize
          );

        if (updatedComments && newPagination) {
          setComments(updatedComments);
          setPagination(newPagination);
          setTotalComments(totalComments);
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
  }, [discussionId, pagination.pageIndex, pagination.pageSize, refreshComments]); // Trigger refresh when refreshComments changes

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: value,
    }));
  };

  // Điều chỉnh chiều cao textarea mỗi khi nội dung thay đổi
  useEffect(() => {
    adjustHeight();
  }, [newComment]);

  // Hàm điều chỉnh chiều cao của textarea tự động
  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Đặt lại chiều cao tự động trước khi tính toán
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Cập nhật chiều cao theo nội dung
    }
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const commentData = {
        discussionId: discussionId,
        content: newComment,
        dateCreated: new Date().toISOString(),
        parentCommentId: null,
        depth: 1,
        isActive: true,
      };

      await DiscussApi.createComment(commentData);
      setRefreshComments(prev => !prev); // Toggle the refresh state to trigger useEffect
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading || !transitioning) {
    return (
      <>
        <div className="loader-container">
          <div className="loader"></div>
        </div>
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
          }

          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1e334a;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="comment-list__content">
      <div className="comment-list_navbar-extension">
        <div className="counts-comment">
          <FontAwesomeIcon icon={faCommentAlt} />
          <p>Comments:</p>
          <p>{totalCommnents}</p>
        </div>
      </div>

      {/* Comment Section */}
      <div className="discussion-comments">
        {/* Write Mode */}
        {!isPreview ? (
          <textarea
            ref={textAreaRef}
            className="comment-input"
            placeholder="Write your comment here... (Markdown is supported)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onInput={adjustHeight} // Adjust height while typing
          />
        ) : (
          <div
            className="comment-preview"
            dangerouslySetInnerHTML={{
              __html: marked(newComment), // Use marked to convert markdown to HTML
            }}
          />
        )}

        <div className="buttons-container">
          <button
            className="toggle-preview-button"
            onClick={() => setIsPreview(!isPreview)}
            disabled={submitting}
          >
            {isPreview ? "Write" : "Preview"}
          </button>

          <button
            className="comment-button"
            onClick={handleAddComment}
            disabled={!newComment.trim() || submitting} // Disable Post button if no content
          >
            {submitting ? "Submitting..." : "Post Comment"}
          </button>
        </div>
      </div>

      <div className="comment-list__header">
        <h3 className="comment-list__title">Comments</h3>
      </div>

      <div className="comment-list__body">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-item__header">
                <img
                  src={comment.urlProfilePicture || "default-avatar.png"}
                  alt="User Avatar"
                  className="comment-item__avatar"
                />
                <p className="comment-item__username">{comment.userName}</p>
                <p className="comment-item__timestamp">{new Date(comment.dateCreated).toLocaleString()}</p>
              </div>
              <p className="comment-item__content">{comment.content}</p>
              {comment.isEdited && <span className="comment-item__edited">Edited</span>}
            </div>
          ))
        ) : (
          <div className="comment-list__no-comments">
            <p>No comments available.</p>
          </div>
        )}
      </div>

      <div className="comment-list__pagination">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(pagination.totalCount / pagination.pageSize)}
            page={pagination.pageIndex}
            onChange={handlePageChange}
            shape="rounded"
            variant="outlined"
            className="pagination-buttons" />
        </Stack>
      </div>

      <style jsx>{`
        /* Bình luận */
        .comment-list_navbar-extension {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          flex-wrap: nowrap; /* Đảm bảo tất cả phần tử con ở trên một dòng */
          margin-top: 6px;
        }

        .counts-comment {
          display: flex; /* Đảm bảo các nội dung trong count-comment được căn chỉnh ngang */
          align-items: center;
          gap: 4px; /* Khoảng cách giữa các icon và chữ */
          white-space: nowrap; /* Ngăn việc xuống dòng cho nội dung này */
        }

       
        /* Comment Section */
.discussion-comments {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 5px;
  border: 1px solid #ddd; /* Optional: Adding border around the section */
}

/* Style for Comment Textarea and Preview */
.comment-input,
.comment-preview {
  padding: 12px;
  font-size: 13px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  background-color: #fffff; /* Gray color for input area */
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
  resize: none;
}

/* Style for Comment Preview */
.comment-preview {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.comment-input::placeholder {
  color: #888;
}

/* Add a line to separate input from buttons */
.separator-line {
  height: 1px;
  background-color: #ccc;
  margin: 15px 0; /* Space between input and buttons */
}

/* Flexbox container for the buttons to align correctly */
.buttons-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px; /* Add a gap above the buttons */
}

/* Style for Write/Preview and Post Comment Buttons */
.comment-button,
.toggle-preview-button {
  flex: 1; /* Ensure buttons take up equal space */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 120px;
  min-width: 100px;
  padding: 10px;
  font-size: 12px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  color: #f9f9f9;
  background: #1e334a; 
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

/* Hover effect */
.comment-button:hover,
.toggle-preview-button:hover {
  color: #ffffff; /* White text on hover */
  background: rgba(30, 51, 74, 0.1); /* Nền xanh nhạt khi hover */
  border-color: #b0b0b0; /* Viền đậm hơn khi hover */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ khi hover */
}

/* Active state effect */
.comment-button.active,
.toggle-preview-button.active {
  color: #ffffff; /* Chữ trắng */
  background: linear-gradient(45deg, #4a6d7f, #2e4756); /* Lighter gradient background */
  font-weight: bold; /* Tăng đậm chữ */
  border-color: #374151; /* Viền đậm khi active */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn */
  transform: scale(1.03); /* Phóng to nhẹ khi active */
}

/* Light moving effect on hover */
.comment-button::before,
.toggle-preview-button::before {
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

.comment-button:hover::before,
.toggle-preview-button:hover::before {
  left: 100%;
}

/* Disabled state styling */
.comment-button:disabled,
.toggle-preview-button:disabled {
  background-color: #ccc;
  color: #666; /* Dark gray text when disabled */
  cursor: not-allowed;
}

/* Hover effect for disabled buttons */
.comment-button:hover:not(:disabled),
.toggle-preview-button:hover:not(:disabled) {
  background-color: #333333; /* Dark gray on hover */
}

        /* pagination */
        .comment-list__pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 30px;
        }

        .comment-list__pagination .MuiPaginationItem-root {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 45px;
          min-width: 35px;
          padding: 6px 10px;
          font-size: 10px;
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-weight: bold;
          color: #14212b;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .comment-list__pagination .MuiPaginationItem-root:hover {
          background: #14212b;
          color: #ffffff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .comment-list__pagination .MuiPaginationItem-root.Mui-selected {
          background: #14212b;
          color: #ffffff;
          box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
          transform: translateY(0);
        }

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

        .comment-list__pagination .MuiPaginationItem-root.Mui-disabled {
          background: #9ca3af;
          color: #e5e7eb;
          cursor: not-allowed;
          box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
        }


         /* list comments */
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

        .comment-item {
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        }

        .comment-item__header {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .comment-item__avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          object-fit: cover;
        }

        .comment-item__username {
          font-weight: bold;
          color: #555;
        }

        .comment-item__timestamp {
          color: #777;
          font-size: 12px;
        }

        .comment-item__content {
          margin-top: 10px;
          font-size: 14px;
          line-height: 1.6;
        }

        .comment-item__edited {
          color: #888;
          font-size: 12px;
        }


      `}</style>
    </div>
  );
}

export default CommentList;
