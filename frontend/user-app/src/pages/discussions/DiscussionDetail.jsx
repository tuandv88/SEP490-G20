import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiscussApi } from "@/services/api/DiscussApi";
import Layout from "@/layouts/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faChevronUp, faBookmark, faShareFromSquare, faBell, faBellSlash, faEdit, faRemove, faDeleteLeft, faTrash, faComment, faCommentAlt, faVoteYea, faChevronDown, faCommentDots, faCommentMedical, faCommentSlash, faComputerMouse, faCommentNodes } from "@fortawesome/free-solid-svg-icons";
import CommentList from "../../components/discussions/CommentList";
import { marked } from 'marked'; // Import marked library

function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // Trạng thái chuyển tiếp
  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await DiscussApi.getDiscussionDetails(id);
        if (!data) {
          throw new Error("Discussion not found.");
        }
        setDiscussion(data);
      } catch (err) {
        setError(err.message || "Failed to fetch discussion details.");
      } finally {
        // Delay thêm 500ms trước khi chuyển
        setTimeout(() => {
          setLoading(false);
          setTransitioning(true); // Chuyển trạng thái để kích hoạt chuyển cảnh
        }, 200);
      }
    };

    fetchDiscussion();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const commentData = {
        discussionId: id,
        content: newComment,
        dateCreated: new Date().toISOString(),
        parentCommentId: null,
        depth: 1,
        isActive: true,
      };

      await DiscussApi.createComment(commentData);
      setRefreshComments((prev) => !prev);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Error adding comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  // Hàm điều chỉnh chiều cao của textarea tự động
  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Đặt lại chiều cao tự động trước khi tính toán
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Cập nhật chiều cao theo nội dung
    }
  };


  // Điều chỉnh chiều cao textarea mỗi khi nội dung thay đổi
  useEffect(() => {
    adjustHeight();
  }, [newComment]);

  return (
    <Layout>
      {loading || !transitioning ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      ) : (
        <div className="discussion-container">
          {/* Header Section */}
          <div className="discussion-header">
            <div className="back-button">
              <button onClick={() => navigate("/discussions/discuss")}>
                <FontAwesomeIcon icon={faChevronLeft} className="back-icon" /> Back
              </button>
            </div>
            <span class="separator">|</span>
            <div className="discussion-title">
              <h5>{discussion?.title}</h5>
            </div>

            <div className="share-button">
              <button className="icon-button">
                <FontAwesomeIcon icon={faShareFromSquare} />
              </button>
            </div>

            <div className="sub-notification-button">
              {discussion.enableNotification ? (
                <button className="icon-button-on">
                  <FontAwesomeIcon icon={faBell} />
                </button>
              ) : (
                <button className="icon-button-off">
                  <FontAwesomeIcon icon={faBellSlash} />
                </button>
              )}
            </div>

            <div className="edit-button">
              <button className="icon-button-edit">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>

            <div className="remove-button">
              <button className="icon-button-remove">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            <div className="bookmark-button">
              <button className="icon-button-bookmark">
                <FontAwesomeIcon icon={faBookmark} />
              </button>
            </div>

            <div className="redirect-comment-button">
              <button className="icon-button-redirect-comment">
                <FontAwesomeIcon icon={faComment} />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="discussion-content">
            <div className="discussion-votes">
              <button><FontAwesomeIcon icon={faChevronUp} /></button>
              <p>{discussion?.voteCount}</p>
              <button><FontAwesomeIcon icon={faChevronDown} /></button>
            </div>

            <div className="discussion-main">
              <div className="discussion-user">
                <img
                  src={discussion?.urlProfilePicture || "default-avatar.png"}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <div className="user-info">
                  <p className="user-name">{discussion?.firstName} {discussion?.lastName}</p>
                  <p className="view-count"><FontAwesomeIcon icon={faEye} className="icon" /> {discussion?.viewCount}</p>
                </div>
              </div>
              <div className="discussion-createdate">
                <p>Created on: {formatDate(discussion?.dateCreated)}</p>
              </div>
              <div className="discussion-tags">
                {discussion?.tags?.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="discussion-description">
                <p>{discussion?.description}</p>
              </div>
              <div className="discussion-image">
                {discussion?.imageUrl && (
                  <img src={discussion?.imageUrl} alt="Post" className="discussion-image" />
                )}
              </div>
            </div>
          </div>


          {/* Navbar Section */}
          <div className="discussion-navbar-extension">
            <div className="count-comment">
              <FontAwesomeIcon icon={faCommentAlt} />
              <p>Comments:</p>
              <p>{discussion?.commentCount}</p>
            </div>
          </div>

          {/* Comment Section */}
          <div className="discussion-comments">
            {/* Write Mode */}
            {!isPreview ? (
              <textarea
                ref={textAreaRef}
                className="comment-input"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onInput={adjustHeight} // Điều chỉnh chiều cao khi người dùng nhập
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

          {/* Comments List Section */}
          <div className="comment-section">
            <CommentList discussionId={id} refresh={refreshComments} />
          </div>
        </div>
      )}
      <style jsx={true}>{`
/* Container chính */
.discussion-container {
  margin: 90px auto;
  padding: 20px;
  width: 100%;
  max-width: 85%; /* Giảm chiều rộng container để không quá sát màn hình */
  font-family: "Helvetica Neue", Arial, sans-serif;
  background-color: #f0f0f0; /* Màu nền sáng */
  border-radius: 10px; /* Bo góc mềm mại */
  border: 1px solid #e0e0e0; /* Viền nhẹ */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
}

/* Tổng quan Header */
.discussion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #ffffff; /* Màu nền trắng */
  border-bottom: 1px solid #e0e0e0;
  height: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Nút Back */
.back-button button {
  background: none;
  border: none;
  color: #555555; /* Màu xanh đồng bộ */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;

  transition: color 0.3s, transform 0.3s;
}

.back-button button:hover {
  color: #1e334a; /* Màu xanh đậm khi hover */
  text-decoration: none; /* Loại bỏ gạch chân */
  transform: scale(1.1); /* Phóng to nhẹ */
}

.separator {
  color: #777777; /* Màu xám nhạt cho thanh phân cách */
  font-size: 16px; /* Kích thước phù hợp */
  gap: 50px;
  padding-left: 10px;
}

/* Tiêu đề */
.discussion-title {
  flex-grow: 1;
  font-size: 20px;
  font-weight: bold;
  color: #1e334a; /* Màu chữ đậm hơn */
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
  padding-left: 10px; /* Khoảng cách giữa tiêu đề và nút đầu tiên */
}
/* Style chung cho tất cả các button */
.icon-button,
.sub-notification-button .icon-button-on,
.sub-notification-button .icon-button-off,
.edit-button .icon-button-edit,
.remove-button .icon-button-remove,
.bookmark-button .icon-button-bookmark,
.redirect-comment-button .icon-button-redirect-comment {
  background-color: transparent;
  border: none;
  color: #626262;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 15px; /* Kích thước font lớn hơn */
  padding: 10px; /* Khoảng cách bên trong nút */
  border-radius: 8px; /* Bo góc cho nút */
}

/* Hiệu ứng hover chung */
.icon-button:hover,
.sub-notification-button .icon-button-on:hover,
.sub-notification-button .icon-button-off:hover,
.edit-button .icon-button-edit:hover,
.remove-button .icon-button-remove:hover,
.bookmark-button .icon-button-bookmark:hover,
.redirect-comment-button .icon-button-redirect-comment:hover {
  color: #1e334a;
  background-color: #f0f0f0; /* Màu nền nhạt khi hover */
}

/* Khoảng cách đều giữa các nút */
.share-button,
.sub-notification-button,
.edit-button,
.remove-button,
.bookmark-button,
.redirect-comment-button {
  display: inline-block; /* Giữ các nút nằm cùng dòng */
  margin: 10px; /* Khoảng cách giữa các nút */
}

/* Content Section */
.discussion-content {
  position: relative;
  display: flex;
  gap: 16px;
  margin-top: 6px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

/* Vote slider */
.discussion-votes {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 40px;
}

.discussion-votes button {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #626262;
  transition: color 0.3s ease;
}

.discussion-votes button:hover {
  color: #1e334a;
}

.discussion-votes p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* Main Content */
.discussion-main {
  margin-left: 60px; /* Dành không gian cho vote slider */
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90%;
}

/* Header Section */
.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

/* User Section */
.discussion-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ccc;
}

/* User Info */
.user-info {
  display: flex; /* Chuyển sang flex để căn chỉnh ngang */
  justify-content: space-between; /* Đẩy view-count sang phải */
  align-items: center; /* Căn giữa theo chiều dọc */
}

/* Tên người dùng */
.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: absolute; /* Đặt vị trí tuyệt đối */
  top: 20px; /* Căn lên trên cùng */
}

/* View Count */
.view-count {
  margin: 0;
  padding-left: 10px;
  font-size: 15px;
  color: #888;
  white-space: nowrap; /* Đảm bảo view-count không xuống dòng */
  position: absolute; /* Đặt vị trí tuyệt đối(Có thể điều chỉnh vị trí tùy ý theo pivot) */
  top: 22px; /* Căn lên trên cùng */
  left: 240px; /* Căn lên trên cùng */
}

/* Created Date */
.discussion-createdate {
  top: 100px; /* Căn lên trên cùng */
  font-size: 14px;
  color: #888;
  white-space: nowrap;
  position: absolute; /* Đặt vị trí tuyệt đối */
  top: 50px; /* Căn lên trên cùng */
  left: 138px; /* Căn lên trên cùng */
}
/* Tags Section */
.discussion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #e3f2fd;
  color: #1e334a;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tag:hover {
  background-color: #bbdefb;
}


/* Description Section */
.discussion-description {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin-top: 12px;
}

/* Image Section */
.discussion-image {
  display: block; /* Chuyển ảnh thành block để căn giữa */
  text-align: center; /* Căn giữa ảnh theo chiều ngang */
  margin-bottom: 16px; /* Khoảng cách dưới ảnh */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng */
  margin: 0 auto; /* Căn giữa ảnh ngang */
  height: auto; /* Giữ tỷ lệ chiều cao ảnh */
}


/* Bình luận */
.discussion-navbar-extension {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #ffffff;
;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap; /* Đảm bảo tất cả phần tử con ở trên một dòng */
  margin-top: 6px;
}

.count-comment {
  display: flex; /* Đảm bảo các nội dung trong count-comment được căn chỉnh ngang */
  align-items: center;
  gap: 4px; /* Khoảng cách giữa các icon và chữ */
  white-space: nowrap; /* Ngăn việc xuống dòng cho nội dung này */
}

/* Kiểm tra nếu các icon có kích thước quá lớn */
.count-comment .fa-comment-alt {
  font-size: 16px; /* Điều chỉnh kích thước icon */
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


/* Sorting Options */
.sorting-options {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  font-size: 14px;
  color: #6c757d;
}

.sorting-options span {
  cursor: pointer;
  transition: color 0.3s;
}

.sorting-options span:hover {
  color: #007bff;
}

/* Loader Container */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Dùng fixed để giữ vị trí luôn ở giữa trang */
  top: 50%; /* Đặt phần tử vào giữa theo trục Y */
  left: 50%; /* Đặt phần tử vào giữa theo trục X */
  transform: translate(-50%, -50%); /* Dịch chuyển phần tử lên trên và sang trái để thực sự nằm giữa */
  height: 100vh; /* Chiều cao toàn bộ viewport */
  width: 100vw; /* Chiều rộng toàn bộ viewport */
  z-index: 9999; /* Đảm bảo loader ở trên các phần tử khác */
}

/* Loader */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Đảm bảo loader ở vị trí cố định trên trang */
  top: 50%; /* Căn giữa theo chiều dọc */
  left: 50%; /* Căn giữa theo chiều ngang */
  transform: translate(-50%, -50%); /* Đảm bảo căn chính xác ở giữa màn hình */
  z-index: 9999; /* Đảm bảo loader nằm trên các phần tử khác */
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
    </Layout>
  );
}

export default DiscussionDetail;
