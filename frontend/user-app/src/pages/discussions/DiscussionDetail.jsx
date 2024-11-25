import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { DiscussApi } from "@/services/api/DiscussApi";
import Layout from "@/layouts/layout"; // Assuming Layout component is in the layouts folder
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the left arrow icon from FontAwesome

function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await DiscussApi.getDiscussionDetails(id);
        setDiscussion(data.discussionDetailDto);
      } catch (err) {
        setError("Failed to fetch discussion details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const newCommentData = {
        id: `${Date.now()}`,
        userId: "currentUserId",
        content: newComment,
        dateCreated: new Date().toISOString(),
      };
      setDiscussion((prev) => ({
        ...prev,
        comments: [newCommentData, ...prev.comments],
      }));
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Error adding comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading discussion details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const styles = {
    container: {
      margin: "50px auto", // Added margin-top to avoid overlap
      maxWidth: "1000px", // Wider layout
      fontFamily: "'Arial', sans-serif", // Academic font
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      lineHeight: "1.6", // More readable line height
      position: "relative", // Ensure back button is positioned within this context
      zIndex: "1", // Ensure it is above other content if necessary
    },
    backButton: {
      display: "inline-flex", // Use flex to align icon and text
      alignItems: "center",
      marginBottom: "20px",
      marginTop: "10px", // Ensure it's not hidden behind the layout
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#007bff",
      backgroundColor: "#f5f5f5",
      border: "1px solid #ddd",
      borderRadius: "8px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background-color 0.3s",
      zIndex: 1000, // Ensure it appears above other elements
    },
    backButtonIcon: {
      marginRight: "8px", // Add space between icon and text
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "30px",
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #f0f0f0",
    },
    title: {
      fontSize: "30px", // Slightly larger title for emphasis
      fontWeight: "bold",
      color: "#333",
      lineHeight: "1.3",
    },
    description: {
      fontSize: "16px",
      color: "#444",
      marginBottom: "20px",
      textAlign: "justify", // Justify text for a more academic appearance
    },
    image: {
      width: "100%",
      maxHeight: "350px",
      objectFit: "contain",
      borderRadius: "12px",
      marginBottom: "20px",
    },
    tags: {
      display: "flex",
      gap: "15px", // Increased gap between tags
      flexWrap: "wrap",
      marginBottom: "30px", // Added margin for better spacing
    },
    tag: {
      backgroundColor: "#f4f4f4",
      color: "#007bff",
      padding: "8px 16px",
      borderRadius: "25px",
      fontSize: "14px",
      cursor: "pointer",
    },
    commentInputContainer: {
      marginBottom: "40px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    commentInput: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    commentButton: {
      alignSelf: "flex-end",
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: submitting ? "#ccc" : "#007bff",
      border: "none",
      borderRadius: "8px",
      cursor: submitting ? "not-allowed" : "pointer",
      transition: "background-color 0.3s",
    },
    comments: {
      marginTop: "30px",
    },
    comment: {
      marginBottom: "15px",
      padding: "15px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      fontSize: "16px",
    },
    commentUser: {
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "8px",
      color: "#333",
    },
    commentContent: {
      fontSize: "14px",
      color: "#555",
    },
    noComments: {
      fontSize: "14px",
      color: "#999",
      textAlign: "center",
    },
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* Back Button with FontAwesome icon */}
        <button
          style={styles.backButton}
          onClick={() => navigate("/discussions/discuss")}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={styles.backButtonIcon} />
          Back to Posts
        </button>

        <div style={styles.header}>
          <img
            src={discussion.userAvatarUrl || "default-avatar.png"}
            alt="User Avatar"
            style={styles.avatar}
          />
          <div>
            <p style={styles.userName}>{discussion.userName}</p>
          </div>
        </div>

        <h1 style={styles.title}>{discussion.title}</h1>
        <p style={styles.description}>{discussion.description}</p>
        {discussion.imageUrl && (
          <img src={discussion.imageUrl} alt="Post" style={styles.image} />
        )}
        <div style={styles.tags}>
          {discussion.tags.map((tag, idx) => (
            <span key={idx} style={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>

        <div style={styles.commentInputContainer}>
          <textarea
            style={styles.commentInput}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            style={styles.commentButton}
            onClick={handleAddComment}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Post Comment"}
          </button>
        </div>

        <div style={styles.comments}>
          <h3>Comments</h3>
          {discussion.comments && discussion.comments.length > 0 ? (
            discussion.comments.map((comment) => (
              <div key={comment.id} style={styles.comment}>
                <p style={styles.commentUser}>User: {comment.userId}</p>
                <p style={styles.commentContent}>{comment.content}</p>
              </div>
            ))
          ) : (
            <p style={styles.noComments}>No comments available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DiscussionDetail;
