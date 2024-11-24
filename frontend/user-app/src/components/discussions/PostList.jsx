import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        if (data && data.discussionDtos && data.discussionDtos.data) {
          setPosts(data.discussionDtos.data);
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

  const styles = {
    container: {
      margin: "20px auto",
      maxWidth: "800px",
      fontFamily: "Arial, sans-serif",
    },
    filters: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
    },
    select: {
      padding: "6px 10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginTop: "5px",
    },
    input: {
      padding: "6px 10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginTop: "5px",
    },
    postList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    card: {
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "12px",
      transition: "box-shadow 0.2s",
      cursor: "pointer",
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      textDecoration: "none",
    },
    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
    },
    badge: {
      backgroundColor: "#f0f0f0",
      color: "#007bff",
      fontSize: "12px",
      padding: "4px 6px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    badgeHover: {
      backgroundColor: "#ddd",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      marginTop: "20px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    error: {
      color: "red",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      {/* Bộ lọc và tìm kiếm */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label htmlFor="orderSelect">Sort by:</label>
          <select
            id="orderSelect"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            style={styles.select}
          >
            <option value="hot">Hot</option>
            <option value="newest">Newest</option>
            <option value="mostvotes">Most Votes</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="tagSearch">Search by Tag:</label>
          <input
            id="tagSearch"
            type="text"
            placeholder="Enter tag"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Danh sách bài viết */}
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && posts.length === 0 && <p>No posts available.</p>}

      {!loading && (
        <div style={styles.postList}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={styles.card}
              onClick={() => handlePostClick(post.id)}
            >
              <div style={styles.cardContent}>
                <h5 style={styles.cardTitle}>{post.title}</h5>
                <div style={styles.tags}>
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={styles.badge}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p>
                  <strong>Username:</strong> {post.userName}
                </p>
                <p>
                  👁️ {post.viewCount} | 👍 {post.voteCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {!loading && (
        <div style={styles.pagination}>
          <button
            style={
              pageIndex === 1
                ? { ...styles.button, ...styles.buttonDisabled }
                : styles.button
            }
            disabled={pageIndex === 1}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            Previous
          </button>
          <span>Page {pageIndex}</span>
          <button
            style={styles.button}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;
