import React, { useEffect, useState } from "react";
import { DiscussApi } from "@/services/api/DiscussApi"; // Đường dẫn phù hợp đến file chứa DiscussApi

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const discussionId = "11111111-1111-1111-1111-111111111111";
  const orderBy = "hot";
  const tags = "ai";

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await DiscussApi.getDiscussionOptions({
          discussionId,
          pageIndex,
          pageSize,
          orderBy,
          tags,
        });

        if (data && data.discussionDtos && data.discussionDtos.data) {
          setPosts(data.discussionDtos.data);
        }
      } catch (err) {
        setError("Failed to fetch posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [pageIndex]);

  const handlePrevPage = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };

  const handleNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)'
  };

  const badgeStyle = {
    backgroundColor: '#f0f0f0',
    color: '#333',
    fontWeight: 500
  };

  const badgeHoverStyle = {
    backgroundColor: '#ddd'
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div className="mt-3">
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && posts.length === 0 && <p>No posts available.</p>}

      {!loading &&
        posts.map((post) => (
          <div
            key={post.id}
            className="card mb-3 post-card"
            style={cardStyle}
            onMouseEnter={(e) => e.target.style.transform = cardHoverStyle.transform}
            onMouseLeave={(e) => e.target.style.transform = ''}
          >
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="badge bg-secondary me-2"
                    style={badgeStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = badgeHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                  >
                    {tag}
                  </span>
                ))}
              </p>
              <p>
                <strong>Username:</strong> {post.userName}
              </p>
              <p>
                <strong>Views:</strong> {post.viewCount} | <strong>Votes:</strong> {post.voteCount}
              </p>
            </div>
          </div>
        ))}

      {/* Phân trang */}
      {!loading && (
        <div className="pagination mt-3" style={paginationStyle}>
          <button className="btn btn-primary me-2" disabled={pageIndex === 1} onClick={handlePrevPage}>
            Previous
          </button>
          <span>Page {pageIndex}</span>
          <button className="btn btn-primary ms-2" onClick={handleNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;
