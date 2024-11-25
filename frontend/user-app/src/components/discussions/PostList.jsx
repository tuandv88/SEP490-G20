import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faChevronUp } from "@fortawesome/free-solid-svg-icons"; 
import { DiscussApi } from "@/services/api/DiscussApi";

function PostList({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [orderBy, setOrderBy] = useState("hot");
  const [tags, setTags] = useState("");

  const navigate = useNavigate();
  const pageSize = 10;

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
        }
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
      {loading && <p>Loading...</p>}
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
      {!loading && (
        <div className="pagination">
          <button
            className={`page-button ${pageIndex === 1 ? "disabled" : ""}`}
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 1}
          >
            Previous
          </button>
          <span>Page {pageIndex}</span>
          <button
            className="page-button"
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .post-list-container {
          margin: 20px auto;
          width: 100%; /* Take full container width */
          max-width: 1200px; /* Wider layout */
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-options {
          display: flex;
          gap: 10px;
        }

        .filter-button {
          cursor: pointer;
          color: #555;
          font-size: 14px;
          padding: 5px 10px;
          border-radius: 4px;
          transition: background-color 0.3s, color 0.3s;
        }

        .filter-button:hover {
          background-color: #e9ecef;
        }

        .filter-button.active {
          color: white;
          background-color: #007bff;
          font-weight: bold;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-input {
          padding: 8px 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          width: 300px;
        }

        .new-button {
          padding: 8px 14px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .new-button:hover {
          background-color: #0056b3;
        }

        .posts {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .post-item {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background-color: white;
          transition: box-shadow 0.3s ease;
          display: flex;
          justify-content: space-between;
        }

        .post-item:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .post-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .post-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .post-tags {
          display: flex;
          gap: 5px;
        }

        .tag {
          background-color: #e0e0e0;
          color: #007bff;
          padding: 2px 6px;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .tag:hover {
          background-color: #d6d6d6;
        }

        .post-meta {
          font-size: 12px;
          color: #555;
        }

        .post-info {
          font-size: 12px;
          color: #888;
        }

        .post-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #555;
          align-items: center;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .icon {
          font-size: 16px;
          color: #555;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 10px;
        }

        .page-button {
          padding: 8px 14px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .page-button.disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default PostList;
