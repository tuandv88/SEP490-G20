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

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      setError(null);
      try {

        const data = await DiscussApi.getDiscussionDetails(id);
        const currentViewTmp = await DiscussApi.updateViewDiscussion({ discussionId: id });
        if (!data) {
          throw new Error("Discussion not found.");
        }
        const userTmp = await AuthService.getUser();
        console.log(userTmp);
        setCurrentUser(userTmp);

        setDiscussion(data);
        setCurrentView(currentViewTmp.currentTotalView);

        const currentUserId = userTmp.profile.sub;

        if (currentUserId === data.userId) {
          setOwnerDiscussion(true);
        } else {
          setOwnerDiscussion(false);
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
  }, [id]);


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
        popup: 'swal-popup',                 // Lớp cho popup
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
      await DiscussApi.removeDiscussionById({ discussionId: id });  // Gọi API xóa thảo luận
      navigate("/discussions/discuss");  // Sau khi xóa xong, điều hướng tới trang danh sách thảo luận
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
              <button className="icon-button-edit">
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

      `}</style>
    </Layout>
  );
}

export default DiscussionDetail;
