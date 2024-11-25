import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiscussApi } from "@/services/api/DiscussApi";
import Layout from "@/layouts/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEye, faChevronUp } from "@fortawesome/free-solid-svg-icons";

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
        setDiscussion(data);
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
      // Lấy thông tin cần thiết từ bài viết và comment
      const commentData = {
        discussionId: id,  // Lấy discussionId từ URL hoặc từ dữ liệu hiện tại
        content: newComment,
        dateCreated: new Date().toISOString(),
        parentCommentId: null,  // Nếu là comment cấp 1, nếu có reply thì có thể sửa lại
        depth: 1,  // Độ sâu của comment
        isActive: true,
      };

      // Gọi API tạo comment
      const newCommentData = await DiscussApi.createComment(commentData);

      // Cập nhật danh sách comments với comment mới
      setDiscussion((prev) => ({
        ...prev,
        comments: [newCommentData, ...prev.comments], // Thêm comment mới vào đầu danh sách
      }));

      setNewComment(""); // Reset nội dung comment
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Error adding comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading discussion details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

  const styles = {
    container: {
      margin: "50px auto",
      maxWidth: "1000px",
      fontFamily: "'Arial', sans-serif",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      lineHeight: "1.6",
      position: "relative",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      marginBottom: "20px",
      marginTop: "10px",
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
    },
    backButtonIcon: {
      marginRight: "8px",
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
      fontSize: "30px",
      fontWeight: "bold",
      color: "#333",
      lineHeight: "1.3",
    },
    description: {
      fontSize: "16px",
      color: "#444",
      marginBottom: "20px",
      textAlign: "justify",
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
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "30px",
    },
    tag: {
      backgroundColor: "#f4f4f4",
      color: "#007bff",
      padding: "8px 16px",
      borderRadius: "25px",
      fontSize: "14px",
      cursor: "pointer",
    },
    info: {
      fontSize: "12px", // Smaller font size
      color: "#888", // Light gray color
      marginBottom: "15px",
      display: "flex", // Align the items horizontally
      gap: "15px", // Space between items
      flexWrap: "wrap", // Allow items to wrap if necessary
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
      textAlign: "center",
    },
  };

  return (
    <Layout>
      <div style={styles.container}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/discussions/discuss")}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={styles.backButtonIcon} />
          Back
        </button>

        <div style={styles.header}>
          <img
            src={discussion?.urlProfilePicture || "default-avatar.png"}
            alt="User Avatar"
            style={styles.avatar}
          />
          <div>
            <p style={styles.userName}>{discussion?.userName}</p>
          </div>
        </div>

        <div style={styles.info}>
          <p>Created on: {formatDate(discussion?.dateCreated)}</p>
          <p>Last updated: {formatDate(discussion?.dateUpdated)}</p>
          <p>
            <FontAwesomeIcon icon={faChevronUp} className="icon" /> {discussion?.viewCount}
          </p>
          <p>
            <FontAwesomeIcon icon={faEye} className="icon" /> {discussion?.voteCount}
          </p>
        </div>

        <h1 style={styles.title}>{discussion?.title}</h1>
        <p style={styles.description}>{discussion?.description}</p>

        {discussion?.imageUrl && (
          <img src={discussion?.imageUrl} alt="Post" style={styles.image} />
        )}

        <div style={styles.tags}>
          {discussion?.tags?.map((tag, idx) => (
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
          {discussion?.comments?.length > 0 ? (
            discussion?.comments?.map((comment) => (
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
        </div>
      </div>
    </Layout>
  );
}

export default DiscussionDetail;
