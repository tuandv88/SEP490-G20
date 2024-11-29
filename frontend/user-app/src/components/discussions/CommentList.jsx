import React, { useEffect, useState, useRef } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faCommentAlt, faComments, faEdit, faReply, faShareFromSquare, faThumbsDown, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { marked } from 'marked'; // Import marked library
import { formatDistanceToNow } from 'date-fns'
import { Typography } from '@mui/material';;
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";
import AuthService from '../../oidc/AuthService'; // Import để lấy dữ liệu Auth...

function CommentList({ discussionId }) {
  const [isPreview, setIsPreview] = useState(false);
  const textAreaRef = useRef(null);
  const [newComment, setNewComment] = useState("");
  const [refreshComments, setRefreshComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [totalCommnents, setTotalComments] = useState(0);
  const [loadingRemoveAPI, setLoadingRemoveAPI] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteCount, setVoteCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3,
    totalCount: 0,
  });

  // New state to handle the comment input
  const [submitting, setSubmitting] = useState(false);
  const [loadingVoteComment, setloadingVoteComment] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('Share');
  const [clicked, setClicked] = useState(false); // State để theo dõi trạng thái click

  const [currentUser, setCurrentUser] = useState(null);
  const [idCurrentUser, setIdCurrentUser] = useState(null);

  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);  // Trạng thái mở/đóng dialog
  const [commentIdToDelete, setCommentIdToDelete] = useState(null); // Lưu ID comment cần xóa

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

        const userTmp = await AuthService.getUser();
        if (userTmp) {
          setCurrentUser(userTmp);
          setIdCurrentUser(userTmp.profile.sub);
        }

      } catch (err) {
        console.error("Discussion No Any Comment.", err);
      } finally {
        setLoading(false);
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

  // Hàm định dạng thời gian, sử dụng formatDate nếu vượt quá 7 ngày
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Tính số ngày đã qua kể từ ngày đăng
    const diffInTime = now - date;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    if (diffInDays >= 7) {
      // Nếu đã qua 1 tuần, hiển thị theo định dạng ngày giờ đầy đủ
      return formatDate(dateString);
    }

    // Nếu chưa qua 7 ngày, sử dụng formatDistanceToNow để hiển thị "x minutes ago", "x days ago", v.v.
    const distance = formatDistanceToNow(date, { addSuffix: true });

    return distance;
  };

  const handleVote = async (voteType, commentId) => {
    try {
      // Nếu đang trong trạng thái loading thì không cho phép vote nữa
      if (loadingVoteComment) return;
      setloadingVoteComment(true); // Đặt loading là true khi bắt đầu gọi API

      // Gọi API để tạo phiếu bầu
      const response = await DiscussApi.createVoteComment({
        discussionId: null, // Thêm discussionId nếu cần
        commentId: commentId,
        voteType: voteType,
        isActive: true, // Hoặc false nếu cần
      });

      if (response) {
        // Cập nhật lại số lượng vote sau khi thực hiện hành động
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? {
                ...comment,
                totalVote: voteType === 'Like' ? comment.totalVote + 1 : comment.totalVote - 1,
              }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloadingVoteComment(false); // Tắt loading khi hoàn thành
    }
  };

  const currentUrl = window.location.href; // Hoặc URL bạn muốn sao chép

  const copyToClipboard = () => {
    // Giả sử bạn sao chép một đường link vào clipboard
    navigator.clipboard.writeText(currentUrl).then(() => {
      setTooltipContent('Link Copied To Clipboard');  // Cập nhật tooltip sau khi sao chép
      setClicked(true); // Đánh dấu là đã click

      // Sau 2 giây, reset lại tooltip về trạng thái ban đầu
      setTimeout(() => {
        setTooltipContent('Share');
        setClicked(false); // Đặt trạng thái clicked lại false
      }, 2000);
    });
  };

  // Hàm mở dialog xác nhận xóa
  const handleOpenRemoveDialog = (commentId) => {
    setCommentIdToDelete(commentId); // Lưu commentId cần xóa
    setOpenRemoveDialog(true); // Mở dialog
  };

  // Hàm đóng dialog
  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false); // Đóng dialog
    setCommentIdToDelete(null); // Reset ID comment
  };

  // Hàm xử lý xóa comment
  const handleRemoveComment = async () => {
    try {
      // Gọi API xóa bình luận ngay khi người dùng nhấn Yes
      const response = await DiscussApi.removeCommentById({ commentId: commentIdToDelete });

      if (response) {
        // Gọi lại hàm refreshComments (truyền từ parent component) để làm mới danh sách comments
        setRefreshComments(prev => !prev);
      }
    } catch (error) {
      console.error("Error removing comment:", error.message);
    } finally {
      handleCloseRemoveDialog(); // Đóng dialog sau khi xóa xong
    }
  };


  // if (loading) {
  //   return (
  //     <>
  //       <div className="loader-container">
  //         <div className="loader"></div>
  //       </div>
  //       <style jsx>{`
  //         .loader-container {
  //           display: flex;
  //           justify-content: center;
  //           align-items: center;
  //           position: fixed;
  //           top: 50%;
  //           left: 50%;
  //           transform: translate(-50%, -50%);
  //           z-index: 9999;
  //         }

  //         .loader {
  //           border: 4px solid #f3f3f3;
  //           border-top: 4px solid #1e334a;
  //           border-radius: 50%;
  //           width: 30px;
  //           height: 30px;
  //           animation: spin 1s linear infinite;
  //         }

  //         @keyframes spin {
  //           0% { transform: rotate(0deg); }
  //           100% { transform: rotate(360deg); }
  //         }
  //       `}</style>
  //     </>
  //   );
  // }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="comment-list__content">

      {/* Comment Navbar Counts*/}
      <div className="comment-list_navbar-extension">
        <div className="counts-comment">
          <FontAwesomeIcon icon={faComments} />
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

      <div className="comment-list__body">
        {comments.length > 0 ? (
          comments.map((comment) => (
            comment.isActive && (
              <div key={comment.id} className="comment-item">
                <div className="comment-item__header">
                  <img
                    src={comment.urlProfilePicture || "default-avatar.png"}
                    alt="User Avatar"
                    className="comment-item__avatar"
                  />
                  <p className="comment-item__username">{comment.userName}</p>
                  <p className="comment-item__timestamp">
                    Created at:  {formatRelativeDate(comment.dateCreated)}
                  </p>

                  {/* Vote Edited */}
                  {comment.isEdited && <span className="comment-item__edited">Edited</span>}
                </div>

                {/* Vote Content */}
                <div className="comment-item__content" dangerouslySetInnerHTML={{ __html: marked(comment.content), }} />

                {/* Vote Section */}
                <div className="comment-item__vote">
                  <button
                    className="vote-icon"
                    onClick={() => handleVote('Like', comment.id)} // Truyền comment.id vào
                  >
                    <FontAwesomeIcon icon={faChevronUp} />
                  </button>
                  <span className="comment-item__vote-count">
                    {comment.totalVote}
                  </span>
                  <button
                    className="vote-icon"
                    onClick={() => handleVote('Dislike', comment.id)} // Truyền comment.id vào
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                </div>


                {/* Action buttons */}
                <div className="comment-item__actions">
                  {/* Other action buttons */}

                  <button className={`comment-item__share ${clicked ? 'clicked' : ''}`}
                    onClick={copyToClipboard}>
                    <Tooltip title={tooltipContent} arrow>
                      <FontAwesomeIcon icon={faShareFromSquare} /> Share
                    </Tooltip>
                  </button>

                  {comment.userId === idCurrentUser && (
                    <>
                      <button className="comment-item__edit">
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        className="comment-item__delete"
                        onClick={() => handleOpenRemoveDialog(comment.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </>
                  )}

                  {/* Dialog xác nhận xóa */}
                  <Dialog
                    open={openRemoveDialog}
                    onClose={handleCloseRemoveDialog}
                    className="delete-dialog"
                  >
                    <DialogTitle className="delete-dialog__title">
                      Are you sure you want to delete this comment?
                    </DialogTitle>
                    <DialogActions className="delete-dialog__actions">
                      {/* Nút "No" sẽ đóng dialog mà không làm gì */}
                      <Button
                        onClick={handleCloseRemoveDialog}
                        className="delete-dialog__btn delete-dialog__btn--no"
                      >
                        No
                      </Button>

                      {/* Nút "Yes" sẽ gọi hàm xóa comment */}
                      <Button
                        onClick={handleRemoveComment}
                        className="delete-dialog__btn delete-dialog__btn--yes"
                      >
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>


                  <button className="comment-item__reply">
                    <FontAwesomeIcon icon={faReply} /> Reply
                  </button>
                </div>
              </div>
            )
          ))
        ) : (
          <div className="comment-list__no-comments">
            <Typography variant="h6" color="textSecondary" align="center">
              There aren't any comment topics here yet!
            </Typography>
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

/* List comments */
.comment-list__content {
  margin-top: 20px;
}

.comment-list__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
}

/* Comment item */
.comment-item {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px; /* Tăng độ bo góc */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ */
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comment-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

/* Header section */
.comment-item__header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.comment-item__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #53585c; /* Viền xung quanh ảnh */
}

.comment-item__username {
  font-weight: bold;
  color: #1e334a;
  font-size: 18px; /* Đổi kích thước font */
}

/* Content section */
.comment-item__content {
  margin-top: 10px;
  font-size: 16px; /* Tăng kích thước chữ */
  line-height: 1.7;
  color: #1e334a;
  margin-bottom: 15px; /* Đảm bảo có khoảng cách dưới cho nội dung */
  max-width: 90%; /* Giới hạn chiều rộng tối đa */
  word-wrap: break-word; /* Tự động xuống dòng nếu nội dung quá dài */
  white-space: normal; /* Cho phép xuống dòng */
  margin-left: 60px;
}

/*No Comment*/
.comment-list__no-comments {
  display: flex;  /* Dùng Flexbox để căn giữa nội dung */
  justify-content: center;  /* Căn ngang */
  align-items: center;  /* Căn dọc */
  height: 100%;  /* Đảm bảo chiều cao đầy đủ để căn giữa tốt */
  text-align: center;  /* Căn giữa văn bản */
  background-color: #f4f6f8;  /* Màu nền nhẹ nhàng */
  padding: 20px;
  border-radius: 10px;  /* Bo góc mềm mại */
  border-radius: 12px; /* Tăng độ bo góc */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ */
}

.comment-list__no-comments p {
  font-size: 18px;  /* Cỡ chữ hợp lý */
  color: #1e334a;  /* Màu chữ chủ đề */
  font-weight: 500;  /* Chữ in đậm nhẹ */
  margin: 0;
  padding: 0;
}

/* Edited label & timestamp */
.comment-item__edited, .comment-item__timestamp {
  color: #888;
  font-size: 14px;
  font-style: italic;
  display: inline-block;
  margin-right: 10px;
}

.comment-item__timestamp {
  font-style: normal;
}

/* Action buttons container */
.comment-item__actions {
  gap: 20px;
  position: absolute;
  right: 20px;
  bottom: 10px;
  display: flex;
  align-items: center;
}

/* Nút Reply luôn hiển thị khi không hover vào bình luận */
.comment-item__reply {
  display: inline-flex;
  color: #1e334a;
  cursor: pointer;
  font-size: 15px;
  transition: color 0.2s ease;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: rgba(0, 123, 255, 0.1); /* Màu nền khi hover vào nút */
}

/* Hiển thị tất cả các nút hành động khi hover vào bình luận */
.comment-item:hover .comment-item__actions {
  display: flex;
}

/* Style cho các nút hành động */
.comment-item__reply,
.comment-item__edit,
.comment-item__delete,
.comment-item__share {
  background: none;
  border: none;
  color: #1e334a;
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease, background-color 0.3s ease;
  padding: 5px 10px;
  border-radius: 5px;
}

/* Hiển thị màu sắc khi hover vào các nút */
.comment-item__reply:hover,
.comment-item__edit:hover,
.comment-item__delete:hover,
.comment-item__share:hover {
  color: #1e334a;
  background-color: rgba(0, 123, 255, 0.1); /* Màu nền khi hover vào các nút action */
}

/* Ẩn các nút Edit, Delete, Share khi không hover vào bình luận */
.comment-item__edit,
.comment-item__delete,
.comment-item__share {
  display: none;
}

/* Hiển thị các nút Edit, Delete, Share khi hover vào bình luận */
.comment-item:hover .comment-item__edit,
.comment-item:hover .comment-item__delete,
.comment-item:hover .comment-item__share {
  display: inline-flex;
}

/* Các nút Vote */
.comment-item__vote {
  display: flex;
  align-items: center;
  color: #53585c; /* Màu mặc định */
  font-size: 16px;
  cursor: pointer;
}

/* Biểu tượng mũi tên và số lượng vote gần nhau */
.comment-item__vote-count {
  font-size: 16px;
  color: #1e334a; /* Màu số lượng vote */
  font-weight: bold; 
  margin: 0 8px;
  text-align: center;
  width: 40px; /* Kích thước cố định cho số lượng vote */
  display: inline-block;
}

/* Biểu tượng mũi tên */
.vote-icon {
  background: none;
  border: none;
  color: #53585c; /* Màu mặc định cho mũi tên */
  font-size: 18px; /* Kích thước mũi tên */
  cursor: pointer;
  transition: color 0.2s ease; /* Hiệu ứng chuyển màu */
  display: inline-flex;
  align-items: center;
}

/* Cải thiện hiệu ứng hover cho mũi tên */
.vote-icon:hover {
  color: #1e334a; /* Màu thay đổi khi hover */
  background-color: rgba(0, 123, 255, 0.1); /* Màu nền khi hover vào các nút mũi tên */
  border-radius: 5px; /* Bo góc nhẹ khi hover */
}

/* Cấu hình chung cho dialog */
.delete-dialog {
  font-family: 'Roboto', sans-serif; /* Dùng font mặc định của MUI */
  border-radius: 8px; /* Bo góc của dialog */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng cho dialog */
}

/* Cấu hình cho tiêu đề của dialog */
.delete-dialog__title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  padding: 20px 24px;
  margin: 0;
}

/* Cấu hình cho các nút hành động trong dialog */
.delete-dialog__actions {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #f9f9f9; /* Màu nền của phần footer (nút) */
  border-top: 1px solid #ddd; /* Đường viền phân cách giữa phần nội dung và nút */
}

/* Cấu hình cho nút "No" */
.delete-dialog__btn--no {
  background-color: #e0e0e0;
  color: #333;
  font-weight: 500;
  padding: 6px 14px;
  text-transform: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Cấu hình cho nút "Yes" */
.delete-dialog__btn--yes {
  background-color: #1e334a; /* Màu đỏ */
  color: #fff;
  font-weight: 600;
  padding: 6px 14px;
  text-transform: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Hiệu ứng hover cho nút "No" */
.delete-dialog__btn--no:hover {
  background-color: #c0c0c0;
  cursor: pointer;
}

/* Hiệu ứng hover cho nút "Yes" */
.delete-dialog__btn--yes:hover {
  background-color: #36495a;
  cursor: pointer;
}

/* Thêm hiệu ứng chuyển động cho Dialog */
.MuiDialog-root {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}



      `}</style>
    </div>
  );
}

export default CommentList;
