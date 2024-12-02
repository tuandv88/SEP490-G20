import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiscussApi } from "@/services/api/DiscussApi";
import Layout from "@/layouts/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faChevronUp, faBookmark, faShareFromSquare, faBell, faBellSlash, faEdit, faTrash, faComment, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CommentList from "../../components/discussions/CommentList";
import ReactHtmlParser from 'html-to-react';
import { marked } from 'marked'; // Import marked library
import AuthService from '../../oidc/AuthService';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của Toastify
import Swal from 'sweetalert2'; // Import SweetAlert2
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Select, MenuItem } from '@mui/material';
import MarkdownIt from "markdown-it";
import MarkdownEditor from "react-markdown-editor-lite";  // Thư viện Markdown Editor
import "react-markdown-editor-lite/lib/index.css";  // Style của editor
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [currentView, setCurrentView] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transitioning, setTransitioning] = useState(false); // Trạng thái chuyển tiếp
  const htmlToReactParser = new ReactHtmlParser.Parser();
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwnerDiscussion, setOwnerDiscussion] = useState(null);
  const [enableNotification, setEnableNotification] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('Share');
  const [clicked, setClicked] = useState(false); // State để theo dõi trạng thái click
  const [voteCount, setVoteCount] = useState(0);
  const [loadingVoteComment, setloadingVoteComment] = useState(false);

  const [categories, setCategories] = useState([]);

  // Khai báo state cần thiết
  const [newPost, setNewPost] = useState({
    id: "",
    categoryId: "",
    title: "",
    content: "",
    tags: [],
    image: { fileName: "", base64Image: "", contentType: "image/png" },
    isActive: true,
  });

  const [errorMessage, setErrorMessage] = useState("");  // Lưu thông báo lỗi
  const [openDialog, setOpenDialog] = useState(false);  // Mở/đóng dialog
  const [openErrorDialog, setOpenErrorDialog] = useState(false);  // Mở/đóng dialog lỗi
  const [showAlert, setShowAlert] = useState(false);  // Hiển thị thông báo thành công
  const [reloadComponentCurrent, setReloadComponentCurrent] = useState(false); // Quản lý reload component
  const [postId, setPostId] = useState("");  // Lưu postId để cập nhật

  const [originalPost, setOriginalPost] = useState({
    id: "",
    categoryId: "",
    title: "",
    content: "",
    tags: [],
    image: { fileName: "", base64Image: "", contentType: "image/png" },
    isActive: true,
  });

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      setError(null);
      try {

        const data = await DiscussApi.getDiscussionDetails(id);
        const categories = await DiscussApi.getCategories();
        const currentViewTmp = await DiscussApi.updateViewDiscussion({ discussionId: id });

        if (!data) {
          throw new Error("Discussion not found.");
        }

        const userTmp = await AuthService.getUser();
        console.log("Hi: ", userTmp);
        setCurrentUser(userTmp);

        setDiscussion(data);
        setCurrentView(currentViewTmp.currentTotalView);
        setVoteCount(data.voteCount);

        if (userTmp) {
          const currentUserId = userTmp.profile.sub;
          if (currentUserId === data.userId) {
            setOwnerDiscussion(true);
          } else {
            setOwnerDiscussion(false);
          }
        }

        if (categories && categories.categoryDtos) {
          setCategories(categories.categoryDtos);
        } else {
          setCategories([]);
        }

        if (data) {
          // Cập nhật dữ liệu vào state
          setNewPost({
            id: data.id,
            categoryId: data.categoryId || "",
            title: data.title || "",
            content: data.description || "",
            tags: data.tags || [],
            image: data.image || { fileName: "", base64Image: "", contentType: "image/png" },
            isActive: data.isActive !== undefined ? data.isActive : true,
          });

          setOriginalPost({
            id: data.id,
            categoryId: data.categoryId || "",
            title: data.title || "",
            content: data.description || "",
            tags: data.tags || [],
            image: data.image || { fileName: "", base64Image: "", contentType: "image/png" },
            isActive: data.isActive !== undefined ? data.isActive : true,
          });
        }
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
  }, [id, reloadComponentCurrent]);


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

  const handleRemoveClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to remove this topic?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e334a',
      cancelButtonColor: '#ffffff',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        popup: 'swal-popup',                // Lớp cho popup
        confirmButton: 'swal-btn-confirm',  // Lớp CSS cho nút "Yes"
        cancelButton: 'swal-btn-cancel'     // Lớp CSS cho nút "Cancel"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveDiscussion();
      }
    });
  };

  const handleRemoveDiscussion = async () => {
    try {
      setLoading(true);  // Bật trạng thái loading khi gọi API xóa
      const response = await DiscussApi.removeDiscussionById({ discussionId: id });  // Gọi API xóa thảo luận

      if (response) {
        // Điều hướng đến trang danh sách thảo luận và truyền thông báo trong state
        navigate("/discussions/discuss", { state: { removeDiscussionStateMessage: "Discussion removed successfully!" } });
      }

    } catch (error) {
      console.error("Error removing discussion:", error.message);
    } finally {
      setLoading(false);  // Tắt trạng thái loading
    }
  };

  // Hàm Toggle Notification
  const handleToggleNotification = async () => {
    try {
      setLoading(true); // Bật loading khi gọi API
      // Gọi API để cập nhật trạng thái thông báo
      await DiscussApi.updateStatusNotificationDiscussionById({ discussionId: id });
      // Nếu bạn vẫn muốn reload trang, có thể dùng navigate(0)
      navigate(0);
    } catch (error) {
      console.error("Error updating status notification discussion:", error.message);
    } finally {
      setLoading(false); // Tắt trạng thái loading
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

  // Thêm ref cho phần bình luận
  const commentSectionRef = useRef(null);

  // Hàm cuộn đến phần bình luận
  const scrollToComments = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: 'smooth', // Cuộn mượt mà
        block: 'start',     // Đảm bảo cuộn đến vị trí đầu của phần tử
        inline: 'nearest',  // Giữ phần tử gần nhất trên trục ngang
      });
    }
  };

  const handleVote = async (voteType) => {
    try {

      // Nếu đang trong trạng thái loading thì không cho phép vote nữa
      if (loadingVoteComment) return;
      setloadingVoteComment(true); // Đặt loading là true khi bắt đầu gọi API

      const response = await DiscussApi.createVoteDiscussion({
        discussionId: discussion.id, // Tham số này lấy từ thông tin thảo luận
        commentId: null,
        voteType: voteType, // 'Like' hoặc 'Dislike'
        isActive: true, // Chỉ định vote có hiệu lực
      });

      if (response) {
        // Cập nhật lại số lượng vote sau khi thực hiện hành động
        setVoteCount(prevCount => voteType === 'Like' ? prevCount + 1 : prevCount - 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloadingVoteComment(false); // Tắt loading khi hoàn thành
    }
  };

  // Hàm đóng dialog và reset form
  const handleDialogClose = () => {
    setOpenDialog(false);  // Đóng dialog
  };

  // Hàm hủy bỏ form và đóng dialog
  const handleDialogCancel = () => {

    setOpenDialog(false);  // Đóng dialog

    // Kiểm tra xem data có tồn tại và có các trường hợp hợp lệ không
    setNewPost(originalPost);
  };

  // Dialog thông báo lỗi
  const handleErrorDialogClose = () => {
    setOpenErrorDialog(false);
  };

  // Hàm xử lý submit để cập nhật bài viết
  const handlePostSubmit = async () => {
    // Kiểm tra nếu các trường chưa được nhập
    if (!newPost.categoryId || !newPost.title || !newPost.content || !newPost.tags) {
      setErrorMessage("Please fill in all data: Category, Tag, Title, Description before submitting.");
      setOpenErrorDialog(true);
      setTimeout(() => {
        setOpenErrorDialog(false);
      }, 30000);  // Đóng thông báo lỗi sau 3 giây
      return;
    }

    // Cập nhật dữ liệu API
    const updateDiscussionDto = {
      id: newPost.id,
      categoryId: newPost.categoryId,
      title: newPost.title,
      description: newPost.content,
      tags: newPost.tags,
      isActive: discussion.isActive,
      closed: discussion.closed,
      pinned: discussion.pinned,
      viewCount: discussion.viewCount,
      enableNotification: discussion.enableNotification
    };

    try {
      // Gọi API cập nhật bài viết
      const response = await DiscussApi.updateDiscuss(updateDiscussionDto);

      // Kiểm tra nếu có ảnh thì thêm vào request
      if (newPost.image && newPost.image.fileName && newPost.image.base64Image && newPost.image.contentType) {
        const discussionImageData = {
          fileName: newPost.image.fileName,
          base64Image: newPost.image.base64Image,
          contentType: newPost.image.contentType,
        };

        const responseUpdateImg = await DiscussApi.updateDiscussImage(newPost.id, discussionImageData);
        if (responseUpdateImg) {
          console.log("Successs", 11122);
        }
      }

      if (response) {

        // Đóng dialog sau khi cập nhật thành công
        handleDialogClose();

        // Gọi reloadComponent sau khi tạo bài viết thành công
        reloadComponent();  // Trigger reload component
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setNewPost({ ...newPost, content: text });  // Lưu nội dung Markdown khi người dùng thay đổi
  };

  const reloadComponent = () => {

    setReloadComponentCurrent(!reloadComponentCurrent); // Trigger lại re-fetch dữ liệu

    setNewPost({
      id: "",
      categoryId: "",
      title: "",
      content: "",
      tags: [],
      image: { fileName: "", base64Image: "", contentType: "image/png" },
      isActive: true,
    });

    // Hiển thị thông báo thành công
    setShowAlert(true);

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  if (loading || !transitioning) {
    return (
      <>
        <div className="loader-container">
          <div className="loader"></div>
        </div>
        <style jsx={true}>{`
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
    <Layout>
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
            <Tooltip title={tooltipContent} arrow>
              <IconButton
                className={`icon-button ${clicked ? 'clicked' : ''}`}
                onClick={copyToClipboard}
              >
                <FontAwesomeIcon icon={faShareFromSquare} />
              </IconButton>
            </Tooltip>
          </div>

          {isOwnerDiscussion && (
            <div className="sub-notification-button">
              {discussion.enableNotification ? (
                <button
                  className="icon-button-on"
                  onClick={handleToggleNotification}
                  disabled={loading} // Disable nút khi đang loading
                >
                  <FontAwesomeIcon icon={faBell} />
                </button>
              ) : (
                <button
                  className="icon-button-off"
                  onClick={handleToggleNotification}
                  disabled={loading} // Disable nút khi đang loading
                >
                  <FontAwesomeIcon icon={faBellSlash} />
                </button>
              )}
            </div>
          )}

          {isOwnerDiscussion && (
            <div className="edit-button">
              <button className="icon-button-edit" onClick={() => setOpenDialog(true)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          )}

          {/* Nút xóa chỉ hiện khi là chủ thảo luận */}
          {isOwnerDiscussion && (
            <div className="remove-button">
              <button
                className="icon-button-remove"
                onClick={handleRemoveClick} // Hiển thị SweetAlert2 modal khi nhấn nút
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}

          <div className="bookmark-button">
            <Tooltip title="Bookmark this page" arrow>
              <IconButton className="icon-button-bookmark">
                <FontAwesomeIcon icon={faBookmark} />
              </IconButton>
            </Tooltip>
          </div>

          {/* Nút hoặc hình ảnh để cuộn xuống phần bình luận */}
          <div className="redirect-comment-button">
            <button className="icon-button-redirect-comment" onClick={scrollToComments}>
              <FontAwesomeIcon icon={faComment} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="discussion-content">

          <div className="discussion-votes">
            <button onClick={() => handleVote('Like')}>
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
            <p>{voteCount}</p>
            <button onClick={() => handleVote('Dislike')}>
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
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
                <p className="view-count"><FontAwesomeIcon icon={faEye} className="icon" /> {currentView}</p>
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

            <div className="discussion-description" dangerouslySetInnerHTML={{ __html: marked(discussion?.description), }} />

            <div className="discussion-image">
              {discussion?.imageUrl && (
                <img src={discussion?.imageUrl} alt="Post" className="discussion-image" />
              )}
            </div>
          </div>
        </div>

        {/* Dialog Popup for Updating a Post */}
        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="lg" className="dialog-submit-container">
          <DialogTitle className="dialog-submit-title">Update Post</DialogTitle>
          <DialogContent className="dialog-submit-content">
            {/* Category */}
            <Select
              label="Category"
              fullWidth
              value={newPost.categoryId || ""}
              onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
              margin="normal"
              variant="outlined"
              className="dialog-submit-select"
            >
              <MenuItem value="">Select One Category</MenuItem>
              {categories && Array.isArray(categories) && categories.filter(category => category.isActive).map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            {/* Title */}
            <TextField
              label="Title"
              fullWidth
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              margin="normal"
              variant="outlined"
              className="dialog-submit-textfield"
            />

            {/* Tags */}
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={newPost.tags.join(", ")}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(",").map(tag => tag.trim()) })}
              margin="normal"
              variant="outlined"
              className="dialog-submit-textfield"
            />

            {/* Description (Content) - Markdown Editor */}
            <MarkdownEditor
              value={newPost.content}
              style={{ height: "200px", marginTop: "16px" }}
              onChange={handleEditorChange}
              renderHTML={(text) => {
                const md = new MarkdownIt();
                return md.render(text);
              }}
            />

            {/* Image Upload */}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64Image = reader.result.split(',')[1];
                    setNewPost({
                      ...newPost,
                      image: {
                        fileName: file.name,
                        base64Image,
                        contentType: file.type,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="dialog-submit-file-input"
            />
          </DialogContent>
          <DialogActions className="dialog-submit-actions">
            <Button onClick={handleDialogCancel} color="secondary" className="dialog-submit-btn-cancel">
              Cancel
            </Button>
            <Button onClick={handlePostSubmit} color="primary" variant="contained" className="dialog-submit-btn-submit">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Pop-up thông báo lỗi khi thiếu thông tin */}
        <Dialog open={openErrorDialog} onClose={handleErrorDialogClose} fullWidth maxWidth="sm" className="dialog-error-container">
          <DialogTitle className="dialog-error-title">Error Updating Post</DialogTitle>
          <DialogContent className="dialog-error-content">
            <p>{errorMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Hiển thị thông báo khi post thành công */}
        {showAlert && (
          <Stack
            sx={{
              position: 'fixed',
              top: 20, // Đặt cách từ đầu trang một chút
              left: '50%', // Căn giữa theo chiều ngang
              transform: 'translateX(-50%)', // Đảm bảo căn giữa tuyệt đối
              zIndex: 9999, // Đảm bảo thông báo hiển thị trên tất cả các phần tử khác
              width: 'auto', // Giới hạn chiều rộng thông báo
              maxWidth: '500px', // Giới hạn chiều rộng tối đa cho thông báo
            }}
          >
            <Alert severity="success">
              Post Updated Successfully!
            </Alert>
          </Stack>
        )}

        {/* Comments List Section */}
        <div className="comment-section" ref={commentSectionRef} >
          <CommentList discussionId={id} />
        </div>
      </div>
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: -15px; /* Move the entire user info section up */
  margin-left: 15px; /* Move the entire user info section up */
}

/* Tên người dùng */
.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* View Count */
.view-count {
  margin: 0;
  font-size: 15px;
  color: #888;
  white-space: nowrap;
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
  margin-top: 5px; /* Move the entire user info section up */
  margin-left: 15px; /* Move the entire user info section up */
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
  margin-left: 80px; /* Move the entire user info section up */
  margin-top: 5px; /* Move the entire user info section up */
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
  margin: 0 auto; /* Căn giữa ảnh ngang */
  width: 100%; /* Đảm bảo ảnh có chiều rộng tối đa là 100% của phần tử chứa */
  max-width: 60%; /* Giới hạn chiều rộng ảnh tối đa là 50% */
  max-height: 500px; /* Giới hạn chiều cao ảnh tối đa */
  height: auto; /* Giữ tỷ lệ chiều cao ảnh */
}



/* Kiểm tra nếu các icon có kích thước quá lớn */
.count-comment .fa-comment-alt {
  font-size: 16px; /* Điều chỉnh kích thước icon */
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

/* Tùy chỉnh các nút trong SweetAlert2 */
/* Tùy chỉnh Popup */
.swal-popup {
  width: 350px; /* Kích thước chiều rộng của popup */
  max-width: 100%; /* Đảm bảo popup không vượt quá kích thước màn hình */
  height: auto; /* Chiều cao tự động tùy theo nội dung */
  padding: 20px; /* Khoảng cách nội dung trong popup */
  border-radius: 8px; /* Bo góc cho popup */
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 14px; /* Kích thước font chữ trong popup */
  text-align: center; /* Căn giữa nội dung */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ cho popup */
}

/* Tùy chỉnh các nút trong SweetAlert2 */
.swal-btn-confirm, .swal-btn-cancel {
  padding: 8px 18px; /* Padding nhỏ hơn để nút gọn gàng hơn */
  font-size: 14px; /* Kích thước font chữ nhỏ */
  font-weight: 500; /* Cân bằng font chữ */
  color: #fff; /* Màu chữ trắng */
  border: none; /* Bỏ viền */
  border-radius: 4px; /* Bo góc cho nút */
  margin: 5px; /* Khoảng cách giữa các nút */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Hiệu ứng hover mượt mà */
  text-transform: uppercase; /* Chữ in hoa */
  width: 120px; /* Chiều rộng cố định cho nút */
}

/* Nút "Yes" */
.swal-btn-confirm {
  background-color: #3085d6; /* Màu nền nút Yes */
}

.swal-btn-confirm:hover {
  background-color: #2378b6; /* Nền tối hơn khi hover */
  transform: translateY(-2px); /* Di chuyển lên nhẹ khi hover */
}

/* Nút "Cancel" */
.swal-btn-cancel {
  padding: 8px 18px; /* Padding nhỏ hơn để nút gọn gàng hơn */
  font-size: 14px; /* Kích thước font chữ nhỏ */
  font-weight: 500; /* Cân bằng font chữ */
  color: #1e334a; /* Chữ màu xanh */
  background-color: #f1f1f1; /* Nền xám nhạt */
  border: 1px solid #d1d1d1; /* Viền mỏng màu xám */
  border-radius: 4px; /* Bo góc cho nút */
  margin: 5px; /* Khoảng cách giữa các nút */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Hiệu ứng hover mượt mà */
}

.swal-btn-cancel:hover {
  background-color: #c32f2f; /* Nền tối hơn khi hover */
  transform: translateY(-2px); /* Di chuyển lên nhẹ khi hover */
}

/* Tùy chỉnh cho các nút khi hover */
.swal-btn-confirm:hover, .swal-btn-cancel:hover {
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15); /* Tạo bóng nhẹ cho nút khi hover */
}

/* Điều chỉnh các nút khi ở trạng thái đang load hoặc disabled */
.swal-btn-confirm:disabled, .swal-btn-cancel:disabled {
  background-color: #e0e0e0; /* Màu nền khi nút disabled */
  cursor: not-allowed; /* Con trỏ khi disabled */
}

/* General dialog styles */
.dialog-submit-container {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dialog-submit-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: #333;
}

.dialog-submit-content {
  padding: 16px 24px;
  background-color: #f9f9f9;
}

.dialog-submit-select, .dialog-submit-textfield {
  margin-bottom: 16px;
  border-radius: 8px;
  width: 100%; /* Đảm bảo các input, select chiếm 100% chiều rộng */
}

.dialog-submit-textfield input {
  padding: 12px 14px;
}

.dialog-submit-select .MuiOutlinedInput-root {
  border-radius: 8px;
}

.dialog-submit-file-input {
  width: auto; /* Đặt chiều rộng tự động thay vì 100% */
  max-width: 500px; /* Giới hạn chiều rộng tối đa */
  padding: 10px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  color: #1e334a;
  background-color: #fff;
  margin-top: 10px;
  font-size: 14px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  transition: all 0.3s ease;
  display: block; /* Đảm bảo nó hiển thị dạng block */
}

.dialog-submit-file-input:hover {
  border-color: #1e334a;
  background-color: #f5f7fa;
}

.dialog-submit-file-input:focus {
  border-color: #1e334a;
  background-color: #fafafa;
  outline: none;
}

.dialog-submit-file-input::file-selector-button {
  padding: 8px 12px;
  font-size: 12px;
  color: #ffffff;
  background-color: #2e4156;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.dialog-submit-file-input::file-selector-button:hover {
  background-color: #1e334a;
}

.dialog-submit-file-input::file-selector-button:active {
  background-color: #1e334a;
}




.dialog-submit-actions {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}
/* Nút Submit */
.dialog-submit-btn-submit {
  text-transform: none;
  text-align: center; /* Đảm bảo chữ luôn căn giữa */
  display: flex;
  align-items: center; /* Căn giữa nội dung theo chiều dọc */
  justify-content: center; /* Căn giữa nội dung theo chiều ngang */
  max-width: 130px; /* Giới hạn kích thước tối đa nhỏ hơn */
  min-width: 100px; /* Giới hạn kích thước tối thiểu nhỏ hơn */
  padding: 8px 12px; /* Giảm kích thước padding */
  font-size: 12px; /* Font chữ nhỏ hơn */
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: bold; /* Font chữ đậm để nổi bật */
  color: #ffffff; /* Màu chữ trắng */
  border: none; /* Loại bỏ viền */
  background: #1e334a; /* Nền màu xanh than đậm */
  border-radius: 8px; /* Bo góc vừa phải */
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn để tạo chiều sâu */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative; /* Hiệu ứng ánh sáng cần position */
  overflow: hidden;
}

/* Hiệu ứng hover cho nút Submit */
.dialog-submit-btn-submit:hover {
  background: #14212b; /* Nền tối hơn khi hover */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); /* Đổ bóng mạnh hơn khi hover */
  transform: translateY(-2px); /* Nhấn nổi */
}

/* Nút đang active */
.dialog-submit-btn-submit:active {
  transform: translateY(0); /* Không nổi khi active */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng nhẹ hơn */
}

/* Hiệu ứng ánh sáng di chuyển qua nút Submit */
.dialog-submit-btn-submit::before {
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

.dialog-submit-btn-submit:hover::before {
  left: 100%; /* Ánh sáng trượt qua nút khi hover */
}

/* Khi nút Submit bị disabled */
.dialog-submit-btn-submit.disabled {
  background: #9ca3af; /* Màu xám nhạt */
  color: #e5e7eb; /* Chữ xám nhạt */
  cursor: not-allowed; /* Không cho phép click */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

/* Nút Cancel */
.dialog-submit-btn-cancel {
  text-transform: none;
  text-align: center; /* Đảm bảo chữ luôn căn giữa */
  display: flex;
  align-items: center; /* Căn giữa nội dung theo chiều dọc */
  justify-content: center; /* Căn giữa nội dung theo chiều ngang */
  max-width: 130px; /* Giới hạn kích thước tối đa nhỏ hơn */
  min-width: 100px; /* Giới hạn kích thước tối thiểu nhỏ hơn */
  padding: 8px 12px; /* Giảm kích thước padding */
  font-size: 12px; /* Font chữ nhỏ hơn */
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: bold; /* Font chữ đậm để nổi bật */
  color: #000000; /* Màu chữ trắng */
  border: none; /* Loại bỏ viền */
  background: #aab0ad; /* Màu nền của nút Cancel */
  border-radius: 8px; /* Bo góc vừa phải */
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn để tạo chiều sâu */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative; /* Hiệu ứng ánh sáng cần position */
  overflow: hidden;
}

/* Hiệu ứng hover cho nút Cancel */
.dialog-submit-btn-cancel:hover {
  background: #8f9795; /* Nền tối hơn khi hover */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); /* Đổ bóng mạnh hơn khi hover */
  transform: translateY(-2px); /* Nhấn nổi */
}

/* Nút đang active */
.dialog-submit-btn-cancel:active {
  transform: translateY(0); /* Không nổi khi active */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng nhẹ hơn */
}

/* Hiệu ứng ánh sáng di chuyển qua nút Cancel */
.dialog-submit-btn-cancel::before {
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

.dialog-submit-btn-cancel:hover::before {
  left: 100%; /* Ánh sáng trượt qua nút khi hover */
}

/* Khi nút Cancel bị disabled */
.dialog-submit-btn-cancel.disabled {
  background: #9ca3af; /* Màu xám nhạt */
  color: #e5e7eb; /* Chữ xám nhạt */
  cursor: not-allowed; /* Không cho phép click */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.dialog-error-title {
  color: #d32f2f;
  font-weight: 600;
}

.dialog-error-content p {
  color: #d32f2f;
  font-size: 1rem;
}

.dialog-submit-btn-cancel, .dialog-submit-btn-submit {
  min-width: 140px; /* Đảm bảo các nút có chiều rộng đủ */
}
      `}</style>
    </Layout>
  );
}

export default DiscussionDetail;
