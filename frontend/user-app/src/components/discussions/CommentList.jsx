import React, { useEffect, useState, useRef } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";
import { NotificationApi } from "@/services/api/notificationApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faComment, faCommentAlt, faComments, faEdit, faRepeat, faReply, faReplyAll, faShareFromSquare, faShower, faThumbsDown, faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { marked } from 'marked'; // Import marked library
import { formatDistanceToNow } from 'date-fns'
import { Typography } from '@mui/material';;
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";
import AuthService from '../../oidc/AuthService'; // Import để lấy dữ liệu Auth...


function CommentList({ discussionId, userIdDiscussion }) {
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
  const [loadingVoteReply, setloadingVoteReply] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('Share');
  const [clicked, setClicked] = useState(false); // State để theo dõi trạng thái click

  const [currentUser, setCurrentUser] = useState(null);
  const [idCurrentUser, setIdCurrentUser] = useState(null);
  const [fullNameCurrentUser, setFullNameCurrentUser] = useState(null);
  const [isAuth, setIsAuthor] = useState(false);

  const [userNotificationSettings, setUserNotificationSettings] = useState('d725fa00-46ef-48e3-815e-d89e08ed7bbd');
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);  // Trạng thái mở/đóng dialog
  const [commentIdToDelete, setCommentIdToDelete] = useState(null); // Lưu ID comment cần xóa


  const [showAlertCheckIsCreateComment, setShowAlertCheckIsCreateComment] = useState(false);

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
          setFullNameCurrentUser(userTmp.profile.firstName + ' ' + userTmp.profile.lastName);
          setIsAuthor(true);
        }

        // Dùng hàm loadReplies để tải replies
        for (let comment of updatedComments) {
          await loadReplies(comment.id); // Gọi hàm loadReplies để tải replies
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

      var response = await DiscussApi.createComment(commentData);
      setRefreshComments(prev => !prev); // Toggle the refresh state to trigger useEffect
      setNewComment("");

      if (commentData) {
        //console.log(commentData);
      }

      if (response) {
        const dataApiDiscussion = await DiscussApi.getDiscussionDetails(discussionId);
        if (dataApiDiscussion && dataApiDiscussion.enableNotification) {
          const notificationTypeIdTmp = await getNotificationTypeIdByName('New Comment');
          // Sau khi tạo bình luận thành công, tạo lịch sử thông báo
          const notificationData = {
            userId: userIdDiscussion, // Lấy từ context hoặc props nếu cần
            notificationTypeId: notificationTypeIdTmp, // Loại thông báo
            userNotificationSettingId: userNotificationSettings, // Cài đặt thông báo của người dùng
            message: `
                      <div class="text-sm text-muted-foreground mb-2 break-words">
                      <p> <strong>${fullNameCurrentUser}</strong> commented on your discussion post: <strong>${newComment}</strong></p>
                      <p><a href="/discussion/${discussionId}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: normal; font-size: 0.875rem;">Click here to view the discussion</a></p>
                      </div> `,
            sentVia: 'Web', // Hoặc 'Email' nếu cần
            status: 'Sent', // Trạng thái gửi
          };

          const response = await NotificationApi.createNotificationHistory(notificationData);
        }
      }
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

  const handleVote = async (voteType, commentId, replyId = null, idReceiveNotification = null) => {
    try {

      if (!currentUser) return;

      if (replyId) {
        // Nếu đang trong trạng thái loading thì không cho phép vote nữa
        if (loadingVoteComment) return;
        setloadingVoteComment(true); // Đặt loading là true khi bắt đầu gọi API

      } else {
        // Nếu đang trong trạng thái loading thì không cho phép vote nữa
        if (loadingVoteReply) return;
        setloadingVoteReply(true); // Đặt loading là true khi bắt đầu gọi API
      }

      const currentCommentId = replyId ? replyId : commentId;

      //const currentIdDiscussion = discussionId;

      // Gọi API để tạo phiếu bầu
      const response = await DiscussApi.createVoteComment({
        discussionId: null, // Thêm discussionId nếu cần
        commentId: currentCommentId,
        voteType: voteType,
        isActive: true, // Hoặc false nếu cần
      });

      //console.log(response)

      if (response) {

        if (!replyId) {
          // Cập nhật số lượng vote cho comment
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

          // Notification.

          const notificationTypeIdTmp = await getNotificationTypeIdByName('New Vote Comment');
          // Sau khi tạo bình luận thành công, tạo lịch sử thông báo
          const notificationData = {
            userId: idReceiveNotification, // Lấy từ context hoặc props nếu cần
            notificationTypeId: notificationTypeIdTmp, // Loại thông báo
            userNotificationSettingId: userNotificationSettings, // Cài đặt thông báo của người dùng
            message: `
                <div class="text-sm text-muted-foreground mb-2 break-words">
                <p> <strong>${fullNameCurrentUser}</strong> Voted Comment your post.</p>
                <p><a href="/discussion/${discussionId}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: normal; font-size: 0.875rem;">Click here to view the discussion.</a></p>
                </div> `,
            sentVia: 'Web', // Hoặc 'Email' nếu cần
            status: 'Sent', // Trạng thái gửi
          };

          // Gọi API để tạo lịch sử thông báo
          const response = await NotificationApi.createNotificationHistory(notificationData);

        } else {
          // Cập nhật số lượng vote cho Reply của comment 
          const statusUpdateToTalVoteByReplyIdAndVoteType = updateTotalVote(replyId, voteType);
          if (statusUpdateToTalVoteByReplyIdAndVoteType) {
            //console.log("Success Add Vote!");

            // Notification.
            const notificationTypeIdTmp = await getNotificationTypeIdByName('New Vote Reply');
            // Sau khi tạo bình luận thành công, tạo lịch sử thông báo
            const notificationData = {
              userId: idReceiveNotification, // Lấy từ context hoặc props nếu cần
              notificationTypeId: notificationTypeIdTmp, // Loại thông báo
              userNotificationSettingId: userNotificationSettings, // Cài đặt thông báo của người dùng
              message: `
                <div class="text-sm text-muted-foreground mb-2 break-words">
                <p> <strong>${fullNameCurrentUser}</strong> Voted Reply your post.</p>
                <p><a href="/discussion/${discussionId}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: normal; font-size: 0.875rem;">Click here to view the discussion.</a></p>
                </div> `,
              sentVia: 'Web', // Hoặc 'Email' nếu cần
              status: 'Sent', // Trạng thái gửi
            };
            // Gọi API để tạo lịch sử thông báo
            const response = await NotificationApi.createNotificationHistory(notificationData);
          }
        }
      }
    } catch (error) {
      //console.log(error);
    } finally {
      if (replyId) {
        setloadingVoteComment(false); // Tắt loading khi hoàn thành
      } else {
        setloadingVoteReply(false);
      }
    }
  };

  function updateTotalVote(replyId, voteType) {
    // Lặp qua tất cả các key trong đối tượng replies
    for (let key in replies) {
      let commentsArray = replies[key];

      // Tìm phần tử trong mảng con theo id
      let element = commentsArray.find(item => item.id === replyId);

      if (element) {
        // Cập nhật totalVote theo voteType
        if (voteType === 'Like') {
          element.totalVote += 1;  // Thêm 1 nếu vote là 'Like'
        } else if (voteType === 'Dislike') {
          element.totalVote -= 1;  // Giảm 1 nếu vote là 'Dislike'
        }

        // Trả về totalVote đã cập nhật
        return element.totalVote;
      }
    }

    // Nếu không tìm thấy phần tử có replyId, trả về null hoặc một giá trị mặc định
    return null;
  }

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


  const [idCommentParentRemove, setIdCommentParentRemove] = useState(null);

  // Hàm mở dialog xác nhận xóa
  const handleOpenRemoveDialog = (commentId, idCommentParentRemove = null) => {
    setCommentIdToDelete(commentId); // Lưu commentId cần xóa
    setOpenRemoveDialog(true); // Mở dialog

    if (idCommentParentRemove) {
      setIdCommentParentRemove(idCommentParentRemove);
    }
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

        if (idCommentParentRemove) {
          handleKeepShowReplies(idCommentParentRemove);
          setIdCommentParentRemove(null);
        }
      }

    } catch (error) {
      console.error("Error removing comment:", error.message);
    } finally {
      handleCloseRemoveDialog(); // Đóng dialog sau khi xóa xong
    }
  };


  // Phương thức nhận vào tên loại thông báo và trả về id của loại đó
  const getNotificationTypeIdByName = async (notificationName) => {
    try {
      // Gọi API để lấy danh sách các loại thông báo
      const { pagination, updatedNotificationTypes } = await NotificationApi.getNotificationTypes({ pageIndex: 1, pageSize: 10 });

      //console.log(updatedNotificationTypes);

      // Tìm loại thông báo có tên trùng với notificationName
      const notificationType = updatedNotificationTypes.find(type => type.name.toLowerCase() === notificationName.toLowerCase());

      // Nếu tìm thấy loại thông báo, trả về id của nó
      if (notificationType) {
        return notificationType.id;
      } else {
        throw new Error(`Notification type with name '${notificationName}' not found.`);
      }
    } catch (error) {
      console.error('Error fetching notification type by name:', error);
      throw error;
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

  const [replies, setReplies] = useState({}); // Dành cho các bình luận con (replies) của mỗi bình luận
  const [replyFormVisible, setReplyFormVisible] = useState(null); // Quản lý form trả lời hiển thị cho mỗi bình luận
  const [contentReplyFromComment, setContentReplyFromComment] = useState(''); // Nội dung trả lời từ người dùng
  const [contentReplyFromReply, setContentReplyFromReply] = useState(''); // Nội dung trả lời từ người dùng
  const [showRepliesMap, setShowRepliesMap] = useState({}); // Quản lý hiển thị các bình luận con (replies)
  const [nestedReplyFormVisible, setNestedReplyFormVisible] = useState(null); // Quản lý form trả lời cho các reply con

  // Hàm để load bình luận con (reply)
  const loadReplies = async (commentId) => {
    try {
      const response = await DiscussApi.getCommentsByCommentParentId(discussionId, commentId, 1, 10); // Lấy danh sách bình luận con
      if (response && response.updatedComments) {
        setReplies(prevReplies => ({
          ...prevReplies,
          [commentId]: response.updatedComments, // Lưu bình luận con vào state theo commentId
        }));
      }
    } catch (error) {
      console.error("Error loading replies:", error);
    }
  };

  const getRepliesCount = (commentId) => {
    // Kiểm tra xem có bình luận con cho commentId không và trả về số lượng
    return Array.isArray(replies[commentId]) ? replies[commentId].length : 0;
  };

  // Hàm hiển thị form trả lời cho bình luận gốc
  const handleToggleReplyFormComment = (commentId) => {
    setReplyFormVisible(replyFormVisible === commentId ? null : commentId); // Hiển thị/ẩn form trả lời cho mỗi comment

    if (commentId !== replyFormVisible) {
      setContentReplyFromComment(''); // Reset nội dung khi chuyển sang bình luận khác

      if (editCommentFormVisible !== null) {
        setEditCommentFormVisible(null); // Đóng form chỉnh sửa
      }
    }

  };

  // Hàm hiển thị form trả lời cho các reply con
  const handleToggleNestedReplyForm = (replyId, replyUserNameCurrent) => {
    setNestedReplyFormVisible(nestedReplyFormVisible === replyId ? null : replyId); // Toggle trạng thái hiển thị form
    if (nestedReplyFormVisible !== replyId) {
      setContentReplyFromReply(`@${replyUserNameCurrent} `);  // Reset nội dung trả lời khi mở form
    }
  };

  // Xử lý khi người dùng gửi phản hồi (đối với bình luận gốc hoặc reply)
  const handleReplyCommentSubmit = async (parentCommentId, depth, idReceiveNotification = null) => {
    try {

      const contentCheck = depth === 2 ? contentReplyFromComment : contentReplyFromReply;


      if (contentReplyFromComment.trim() === '' && (depth === 2)) {
        alert('Please enter a reply, content cannot be empty!');
        return;
      } else if (contentReplyFromReply.trim() === '' && (depth === 3)) {
        alert('Please enter a reply, content cannot be empty!');
        return;
      }

      const newComment = {
        discussionId: discussionId, // ID thảo luận
        content: contentCheck, // Nội dung trả lời
        dateCreated: new Date().toISOString(), // Thời gian hiện tại
        parentCommentId: parentCommentId, // ID của bình luận gốc (cha)
        depth: depth, // Depth tùy thuộc vào vị trí bình luận (depth = 3 cho reply của reply)
        isActive: true, // Đánh dấu là bình luận hợp lệ
      };

      //console.log(newComment);

      const response = await DiscussApi.createComment(newComment); // Gọi API để tạo bình luận

      if (response) {
        if (depth == 2) {
          setContentReplyFromComment(''); // Reset nội dung bình luận
        } else if (depth == 3) {
          setContentReplyFromReply('');
        }

        setReplyFormVisible(null); // Đóng form trả lời cho bình luận gốc
        setNestedReplyFormVisible(null); // Đóng form trả lời cho reply con
        //loadReplies(parentCommentId); // Tải lại bình luận con

        handleKeepShowReplies(parentCommentId);

        //console.log("Success!", newComment);

        if (depth == 2) {
          const dataApiDiscussion = await DiscussApi.getDiscussionDetails(discussionId);
          if (dataApiDiscussion && dataApiDiscussion.enableNotification) {
            const notificationTypeIdTmp = await getNotificationTypeIdByName('New Reply Comment');

            // Sau khi tạo bình luận thành công, tạo lịch sử thông báo
            const notificationData = {
              userId: userIdDiscussion, // Lấy từ context hoặc props nếu cần
              notificationTypeId: notificationTypeIdTmp, // Loại thông báo
              userNotificationSettingId: userNotificationSettings, // Cài đặt thông báo của người dùng
              message: `
                      <div class="text-sm text-muted-foreground mb-2 break-words">
                      <p> <strong>${fullNameCurrentUser}</strong> Replied to comment on your post: <strong>${contentCheck}</strong></p>
                      <p><a href="/discussion/${discussionId}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: normal; font-size: 0.875rem;">Click here to view the comment</a></p>
                      </div> `,
              sentVia: 'Web', // Hoặc 'Email' nếu cần
              status: 'Sent', // Trạng thái gửi
            };

            // Gọi API để tạo lịch sử thông báo
            const response = await NotificationApi.createNotificationHistory(notificationData);
          }

        } else if (depth == 3) {
          const notificationTypeIdTmp = await getNotificationTypeIdByName('New Reply To Reply');

          // Sau khi tạo bình luận thành công, tạo lịch sử thông báo
          const notificationData = {
            userId: idReceiveNotification, // Lấy từ context hoặc props nếu cần
            notificationTypeId: notificationTypeIdTmp, // Loại thông báo
            userNotificationSettingId: userNotificationSettings, // Cài đặt thông báo của người dùng
            message: `
                    <div class="text-sm text-muted-foreground mb-2 break-words">
                    <p> <strong>${fullNameCurrentUser}</strong> Replied to reply on your post: <strong>${contentCheck}</strong></p>
                    <p><a href="/discussion/${discussionId}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: normal; font-size: 0.875rem;">Click here to view the comment</a></p>
                    </div> `,
            sentVia: 'Web', // Hoặc 'Email' nếu cần
            status: 'Sent', // Trạng thái gửi
          };

          // Gọi API để tạo lịch sử thông báo
          const response = await NotificationApi.createNotificationHistory(notificationData);
        }
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  // Hàm hiển thị/ẩn các bình luận con
  const handleShowOrHidenReplies = async (commentId) => {
    // Kiểm tra nếu chưa load replies, thì load
    if (!replies[commentId]) {
      await loadReplies(commentId);  // Gọi API để tải các câu trả lời (replies)
    }
    // Toggle trạng thái hiển thị của bình luận này
    setShowRepliesMap((prevMap) => ({
      ...prevMap,
      [commentId]: !prevMap[commentId],  // Toggle giá trị showReplies của bình luận này
    }));
  };

  const handleKeepShowReplies = async (commentId) => {
    await loadReplies(commentId);
    setShowRepliesMap((prevMap) => ({
      ...prevMap,
      [commentId]: true,
    }));
  };

  // Auth 
  const handleCreateCommentButtonClick = () => {
    if (!isAuth) {
      setShowAlertCheckIsCreateComment(true);
      setTimeout(() => setShowAlertCheckIsCreateComment(false), 5000);
    } else {
      handleAddComment();
    }
  };

  const handleCreateReplyButtonClick = (parentCommentId, depth) => {
    if (!isAuth) {
      setShowAlertCheckIsCreateComment(true);
      setTimeout(() => setShowAlertCheckIsCreateComment(false), 5000);
    } else {
      handleReplyCommentSubmit(parentCommentId, depth)
    }
  };

  const handleCreateReplyNestedButtonClick = (parentCommentId, depth, idReceiveNotification = null) => {
    if (!isAuth) {
      setShowAlertCheckIsCreateComment(true);
      setTimeout(() => setShowAlertCheckIsCreateComment(false), 5000);
    } else {
      handleReplyCommentSubmit(parentCommentId, depth, idReceiveNotification)
    }
  };


  const [editCommentFormVisible, setEditCommentFormVisible] = useState(null);
  const [contentEditFromComment, setContentEditFromComment] = useState('');
  const [editNestedReplyFormVisible, setEditNestedReplyFormVisible] = useState(null);
  const [contentEditFromReply, setContentEditFromReply] = useState('');

  // Comment Handler.
  const handleToggleEditFormComment = (idComment, content) => {

    if (idComment === editCommentFormVisible) {
      setContentEditFromComment('');
    } else {

      setContentEditFromComment(content);

      // Nếu đang mở form trả lời, đóng form trả lời
      if (replyFormVisible !== null) {
        setReplyFormVisible(null); // Đóng form trả lời
      }
    }

    setEditCommentFormVisible(editCommentFormVisible === idComment ? null : idComment);
  };

  // Xử lý khi người dùng gửi phản hồi (đối với bình luận gốc hoặc reply)
  const handleEditCommentSubmit = async (idComment) => {
    try {

      if (contentEditFromComment.trim() === '') {
        alert('Please enter a reply, content cannot be empty!');
        return;
      }

      const updatedComment = {
        id: idComment, // ID comment cần chỉnh sửa
        discussionId: discussionId, // ID của discussion
        content: contentEditFromComment, // Nội dung chỉnh sửa
        isActive: true, // Trạng thái hoạt động của comment
        parentCommentId: null, // ID của comment cha (nếu có)
        depth: 2, // Độ sâu của comment (tùy chỉnh theo yêu cầu của bạn)
      };

      const response = await DiscussApi.updateComment({ updateCommentData: updatedComment });
      if (response) {
        setEditCommentFormVisible(null); // Đóng form trả lời cho bình luận gốc
        setContentEditFromComment('');
        setRefreshComments(prev => !prev);

        //console.log("Success Edit!", newComment);
      }
    } catch (error) {
      console.error("Error submitting edit:", error);
    }
  };

  // Comment Handler.
  const handleToggleEditNestedFormComment = (idComment, contentReplyEdit) => {

    if (idComment === editNestedReplyFormVisible) {
      setContentEditFromReply('');
    } else {
      setContentEditFromReply(contentReplyEdit);
    }

    setEditNestedReplyFormVisible(editNestedReplyFormVisible === idComment ? null : idComment);
  };

  const handleEditReplyNestedButtonClick = (idCommentCurrent, parentCommentId, depth) => {
    if (!isAuth) {
      setShowAlertCheckIsCreateComment(true);
      setTimeout(() => setShowAlertCheckIsCreateComment(false), 5000);
    } else {
      handleEditNestedReplyCommentSubmit(idCommentCurrent, parentCommentId, depth)
    }
  };

  // Xử lý khi người dùng gửi phản hồi (đối với bình luận gốc hoặc reply)
  const handleEditNestedReplyCommentSubmit = async (idCommentCurrent, parentCommentId, depth) => {
    try {

      if (contentEditFromReply.trim() === '') {
        alert('Please enter a reply, content cannot be empty!');
        return;
      }

      const updatedComment = {
        id: idCommentCurrent, // ID comment cần chỉnh sửa
        discussionId: discussionId, // ID của discussion
        content: contentEditFromReply, // Nội dung chỉnh sửa
        isActive: true, // Trạng thái hoạt động của comment
        parentCommentId: parentCommentId, // ID của comment cha (nếu có)
        depth: depth, // Độ sâu của comment (tùy chỉnh theo yêu cầu của bạn)
      };

      //console.log(updatedComment);

      const response = await DiscussApi.updateComment({ updateCommentData: updatedComment });
      if (response) {
        setEditNestedReplyFormVisible(null); // Đóng form trả lời cho bình luận gốc
        setContentEditFromReply('');
        loadReplies(parentCommentId); // Tải lại bình luận con

        console.log("Success Edit!", newComment);
      }
    } catch (error) {
      console.error("Error submitting edit:", error);
    }
  };

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
            onClick={handleCreateCommentButtonClick}
            disabled={!newComment.trim() || submitting} // Disable Post button if no content
          >
            {submitting ? "Submitting..." : "Post Comment"}
          </button>
        </div>
      </div>



      {/* Alert Popup Dialog New Post*/}
      {showAlertCheckIsCreateComment && (
        <Stack
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: 'auto',
            maxWidth: '500px',
          }}
        >
          <Alert severity="error">
            Please log in to create a new Comment or Reply!
          </Alert>
        </Stack>
      )}

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
                  <div className="comment-item__header-text">
                    <p className="comment-item__username">{comment.userName}</p>
                    <p className="comment-item__timestamp">
                      Created at: {formatRelativeDate(comment.dateCreated)}
                    </p>
                    {comment.isEdited && <span className="comment-item__edited">Edited</span>}
                  </div>
                </div>

                <div className="comment-item__content" dangerouslySetInnerHTML={{ __html: marked(comment.content) }} />

                <div className="comment-item__vote">
                  <button
                    className="vote-icon"
                    onClick={() => handleVote('Like', comment.id, null, comment.userId)}
                  >
                    <FontAwesomeIcon icon={faChevronUp} />
                  </button>
                  <span className="comment-item__vote-count">{comment.totalVote}</span>
                  <button
                    className="vote-icon"
                    onClick={() => handleVote('Dislike', comment.id, null, comment.userId)}
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                </div>

                <div className="comment-item__actions">
                  <button
                    className={`comment-item__share ${clicked ? 'clicked' : ''}`}
                    onClick={copyToClipboard}
                  >
                    <Tooltip title={tooltipContent} arrow>
                      <FontAwesomeIcon icon={faShareFromSquare} /> Share
                    </Tooltip>
                  </button>

                  {comment.userId === idCurrentUser && (
                    <>
                      <button className="comment-item__edit"
                        onClick={() => handleToggleEditFormComment(comment.id, comment.content)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        className="comment-item__delete"
                        onClick={() => handleOpenRemoveDialog(comment.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </>
                  )}

                  <button
                    className="comment-item__reply"
                    onClick={() => handleToggleReplyFormComment(comment.id)}
                  >
                    <FontAwesomeIcon icon={faReply} /> Reply
                  </button>

                  <button
                    className="comment-item__show-reply"
                    onClick={() => handleShowOrHidenReplies(comment.id)}
                  >
                    <FontAwesomeIcon icon={faComments} />
                    {showRepliesMap[comment.id]
                      ? `Hide Reply (${getRepliesCount(comment.id)})`
                      : `Show All Reply (${getRepliesCount(comment.id)})`}
                  </button>

                  {/*Replies*/}
                  {replyFormVisible === comment.id && (
                    <div className="reply-form">
                      <textarea
                        placeholder="Type your reply here..."
                        value={contentReplyFromComment}
                        onChange={(e) => setContentReplyFromComment(e.target.value)}
                      />
                      <button onClick={() => handleCreateReplyButtonClick(comment.id, 2)}>Reply Now</button>
                    </div>
                  )}

                  {/*Comment*/}
                  {editCommentFormVisible === comment.id && (
                    <div className="reply-form">
                      <textarea
                        placeholder="Type your reply here..."
                        value={contentEditFromComment}
                        onChange={(e) => setContentEditFromComment(e.target.value)}
                      />
                      <button onClick={() => handleEditCommentSubmit(comment.id)}>Edit Now</button>
                    </div>
                  )}

                  {showRepliesMap[comment.id] && replies[comment.id]?.length > 0 && (
                    <div className="replies">
                      {replies[comment.id].map((reply) => (
                        <div key={reply.id} className="comment-item reply">
                          <div className="comment-item__header">
                            <img
                              src={reply.urlProfilePicture || "default-avatar.png"}
                              alt="User Avatar"
                              className="comment-item__avatar"
                            />
                            <div className="comment-item__header-text">
                              <p className="comment-item__username_replies">{reply.userName}</p>
                            </div>
                            <p className="comment-item__timestamp_replies">
                              Created at: {formatRelativeDate(reply.dateCreated)}
                            </p>
                            {reply.isEdited && <span className="comment-item__edited_replies">Edited</span>}
                          </div>
                          <div className="comment-item__content">{reply.content}</div>

                          <div className="comment-item__vote">
                            <button
                              className="vote-icon"
                              onClick={() => handleVote('Like', reply.id, reply.id, reply.userId)}
                            >
                              <FontAwesomeIcon icon={faChevronUp} />
                            </button>
                            <span className="comment-item__vote-count">{reply.totalVote}</span>
                            <button
                              className="vote-icon"
                              onClick={() => handleVote('Dislike', reply.id, reply.id, reply.userId)}
                            >
                              <FontAwesomeIcon icon={faChevronDown} />
                            </button>
                          </div>

                          {reply.userId !== idCurrentUser && (
                            <button
                              className="comment-item__reply"
                              onClick={() => handleToggleNestedReplyForm(reply.id, reply.userName)}
                            >
                              <FontAwesomeIcon icon={faReply} /> Reply to this reply
                            </button>
                          )}


                          {reply.userId === idCurrentUser && (
                            <>
                              <button className="comment-item__edit_replies"
                                onClick={() => handleToggleEditNestedFormComment(reply.id, reply.content)}
                              >
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>

                              <button
                                className="comment-item__delete_replies"
                                onClick={() => handleOpenRemoveDialog(reply.id, comment.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                            </>
                          )}

                          <button
                            className={`comment-item__share-edit ${clicked ? 'clicked' : ''}`}
                            onClick={copyToClipboard}
                          >
                            <Tooltip title={tooltipContent} arrow>
                              <FontAwesomeIcon icon={faShareFromSquare} /> Share
                            </Tooltip>
                          </button>


                          {nestedReplyFormVisible === reply.id && (
                            <div className="reply-form">
                              <textarea
                                placeholder="Type your reply here..."
                                value={contentReplyFromReply}
                                onChange={(e) => setContentReplyFromReply(e.target.value)}
                              />
                              <button onClick={() => handleCreateReplyNestedButtonClick(comment.id, 3, reply.userId)}>Reply Now</button>
                            </div>
                          )}

                          {editNestedReplyFormVisible === reply.id && (
                            <div className="reply-form-edit">
                              <textarea
                                placeholder="Type your reply here..."
                                value={contentEditFromReply}
                                onChange={(e) => setContentEditFromReply(e.target.value)}
                              />
                              <button onClick={() => handleEditReplyNestedButtonClick(reply.id, comment.id, 3)}>Edit Now</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
          flex-wrap: nowrap; /* Đảm bảo tất cả phần tử con ở trên một dòng */
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
  background-color: #ffffff;
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
  background: #0a192f;
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
  background: #1e3a5f; /* Nền xanh nhạt khi hover */
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
          color: #0a192f;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .comment-list__pagination .MuiPaginationItem-root:hover {
          background: #0a192f;
          color: #ffffff;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .comment-list__pagination .MuiPaginationItem-root.Mui-selected {
          background: #0a192f;
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
.comment-item {
  padding: 16px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
  position: relative;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: 5px;
}

.comment-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Comment header */
.comment-item__header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
}

.comment-item__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid #c2c2c2;
}

.comment-item__username {
  font-weight: 600;
  font-size: 1rem;
  color: #0a192f;
}

.comment-item__timestamp {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-left: auto;
}

.comment-item__edited {
  font-size: 0.75rem;
  color: #95a5a6;
  margin-left: 2px;
}

/* Comment content */
.comment-item__content {
  font-size: 0.9rem;
  color: #0a192f;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-bottom: 3px;
  margin-left: 50px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
}

/* Voting section and Action buttons */
.comment-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

/* Voting section */
.comment-item__vote {
  display: flex;
  align-items: center;
}

.vote-icon {
  background: transparent;
  border: none;
  color: #bec0c2;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 4px;
  margin-bottom: 3px;
  font-size: 16px;
  padding: 4px;
}

.vote-icon:hover {
  color: #0a192f;
}

.comment-item__vote-count {
  margin: 0 6px;
  font-size: 1rem;
  font-weight: 600;
  color: #34495e;
}

/* Action buttons */
.comment-item__actions {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.comment-item__share,
.comment-item__edit,
.comment-item__delete,
.comment-item__reply,
.comment-item__show-reply {
  background: transparent;
  border: none;
  color: #0a192f;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  padding: 2px 7px;
  border-radius: 4px;
  margin-top: 5px;
  margin-left: 15px;
}

.comment-item__delete_replies,
.comment-item__edit_replies,
.comment-item__share-edit {
  background: transparent;
  border: none;
  color: #0a192f;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  border-radius: 5px;
  margin-top: 0px;
  margin-left: 10px;
}

.comment-item__edit_replies:hover,
.comment-item__delete_replies:hover,
.comment-item__share-edit:hover {
  background-color: #ecf0f1;
}

.comment-item__share {
  background: #0a192f;
  color: white;
}

.comment-item__share:hover {
  background: #2c435c;
}

.comment-item__edit:hover,
.comment-item__delete:hover,
.comment-item__reply:hover,
.comment-item__show-reply:hover {
  background-color: #ecf0f1;
}

/* Reply form */
.reply-form {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-left: 4%;
  background-color: #f6f7f7;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.reply-form textarea {
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  width: 100%;
  font-size: 0.95rem;
  resize: vertical;
  background-color: #fff;
  transition: all 0.2s ease;
}

.reply-form textarea:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.reply-form button {
  align-self: flex-end;
  padding: 7px 13px;
  background: #0a192f;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.reply-form button:hover {
  background: #1e3a5f;
}

/* Reply form */
.reply-form-edit {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-left: 4%;
  background-color: #f6f7f7;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.reply-form-edit textarea {
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  width: 100%;
  font-size: 0.95rem;
  resize: vertical;
  background-color: #fff;
  transition: all 0.2s ease;
}

.reply-form-edit textarea:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.reply-form-edit button {
  align-self: flex-end;
  padding: 7px 13px;
  background: #0a192f;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.reply-form-edit button:hover {
  background: #1e3a5f;
}

/* Replies list */
.replies {
  border-top: 1px solid #cbcdd0;
  width: 95%;
  margin-left: 4%;
}

.replies .comment-item {
  margin-top: 5px;
  padding-left: 20px;
}

.replies .comment-item .comment-item__header {
  margin-bottom: 6px;
  padding-bottom: 6px;
  margin-top: 2px;
}

.comment-item__edited_replies {
  font-size: 0.75rem;
  color: #95a5a6;
  position: absolute;
  top: 65px;
  left: 23px;
}

.comment-item__username_replies {
  font-weight: 600;
  font-size: 1rem;
  color: #0a192f;
  margin-top: -20px;
  margin-left: 5px;
}

.comment-item__timestamp_replies {
  font-size: 0.8rem;
  color: #7f8c8d;
  position: absolute;
  bottom: 5px; 
  left: 75px;
  top: 42px;
  white-space: nowrap; 
  overflow: hidden;
  height: 20px;
  text-overflow: ellipsis; /* Adds ... if text overflows */
  max-width: calc(100% - 75px); /* Ensures it doesn't overlap with other content */
}

.replies .comment-item__content {
  margin-top: 5px;
  background-color: #fff;
  border-radius: 4px;
  margin-left: 55px;
}


/* Responsive adjustments */
@media (max-width: 576px) {
  .comment-item__footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .comment-item__vote {
    margin-bottom: 8px;
  }
  
  .comment-item__actions {
    width: 100%;
    justify-content: space-between;
  }
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
