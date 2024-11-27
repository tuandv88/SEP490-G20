import React, { useEffect, useState } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";

function CommentList({ discussionId, refresh }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
  });
  const [transitioning, setTransitioning] = useState(false);

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

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);
    const pageButtons = [];

    // If total pages <= 5, display all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      pageButtons.push(1); // Always show first page

      if (pagination.pageIndex > 3) pageButtons.push("..."); // Show ... if gap from first page

      const startPage = Math.max(2, pagination.pageIndex - 2);
      const endPage = Math.min(totalPages - 1, pagination.pageIndex + 2);

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
      }

      if (pagination.pageIndex < totalPages - 2) pageButtons.push("..."); // Show ... if gap from last page

      pageButtons.push(totalPages); // Always show last page
    }

    return pageButtons.map((page, idx) => (
      <button
        key={idx}
        className={`comment-list__pagination-button ${pagination.pageIndex === page ? "active" : ""}`}
        onClick={() => page !== "..." && handlePageChange(page)}
        disabled={page === "..." || pagination.pageIndex === page}
      >
        {page}
      </button>
    ));
  };

  const handlePageChange = (pageIndex) => {
    if (pageIndex > 0 && pageIndex <= Math.ceil(pagination.totalCount / pagination.pageSize)) {
      setPagination((prev) => ({
        ...prev,
        pageIndex,
      }));
    }
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
          {!loading && pagination.totalCount > 0 && (
            <div className="pagination">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex === 1}
                className={`page-item ${pagination.pageIndex === 1 ? 'disabled' : ''}`}
              >
                &lt;
              </button>

              {/* Page Number Buttons */}
              {renderPaginationButtons().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => page !== "..." && handlePageChange(page)}
                  className={`page-item ${pagination.pageIndex === page ? 'active' : ''} ${page === "..." ? 'dots' : ''}`}
                  disabled={page === "..." || pagination.pageIndex === page}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex * pagination.pageSize >= pagination.totalCount}
                className={`page-item ${pagination.pageIndex * pagination.pageSize >= pagination.totalCount ? 'disabled' : ''}`}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .page-item {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          font-size: 12px;
          color: #1e334a;
          background: #f9f9f9;
          border: 0.2px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          margin: 0 5px;
        }

        .page-item:hover {
          color: #fff;
          background: #1e334a;
          border-color: #1e334a;
        }

        .page-item.active {
          background-color: #1e334a;
          color: #fff;
          font-weight: bold;
        }

        .page-item.disabled {
          cursor: not-allowed;
          background-color: #f8f9fa;
          color: #adb5bd;
        }

        .page-item.dots {
          font-size: 16px;
          color: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default CommentList;
