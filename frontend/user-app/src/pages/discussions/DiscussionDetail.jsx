import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiscussApi } from "@/services/api/DiscussApi";
import Layout from "@/layouts/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faChevronUp, faBookmark, faShareFromSquare, faBell, faBellSlash, faEdit, faTrash, faComment, faChevronDown, faTag, faUser, faClock, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import CommentList from "@/components/discussions/CommentList";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import AuthService from '@/oidc/AuthService';
import Swal from 'sweetalert2';
import { Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, Alert, Chip } from '@mui/material';
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { NotificationApi } from "@/services/api/notificationApi";
import { motion } from "framer-motion";

function DiscussionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [currentView, setCurrentView] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [fullNameCurrentUser, setFullNameCurrentUser] = useState(null);
  const [isOwnerDiscussion, setOwnerDiscussion] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('Share');
  const [clicked, setClicked] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [loadingVoteComment, setLoadingVoteComment] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userNotificationSettings, setUserNotificationSettings] = useState('631cca78-80ba-4448-9e54-38eb7bbeec91');
  const [newPost, setNewPost] = useState({
    id: "",
    categoryId: "",
    title: "",
    content: "",
    tags: [],
    image: { fileName: "", base64Image: "", contentType: "image/png" },
    isActive: true,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [reloadComponentCurrent, setReloadComponentCurrent] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const commentSectionRef = useRef(null);
  const [currentStatusDiscussion, setCurrentStatusDiscussion] = useState(false);

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
        setCurrentUser(userTmp);
        setDiscussion(data);
        setCurrentView(currentViewTmp.currentTotalView);
        setVoteCount(data.voteCount);
        setCurrentStatusDiscussion(data.isActive);

        if (userTmp) {
          console.log(userTmp);
          const currentUserId = userTmp.profile.sub;
          setFullNameCurrentUser(userTmp.profile.firstName + ' ' + userTmp.profile.lastName);
          setOwnerDiscussion(currentUserId === data.userId);
        }

        if (categories && categories.categoryDtos) {
          setCategories(categories.categoryDtos);
        }

        if (data) {
          setNewPost({
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
        //setError(err.message || "Failed to fetch discussion details.");
      } finally {
        setLoading(false);
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32679b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveDiscussion();
      }
    });
  };

  const handleRemoveDiscussion = async () => {
    try {
      setLoading(true);
      const response = await DiscussApi.removeDiscussionById({ discussionId: id });
      if (response) {
        navigate("/discussions/discuss", { state: { removeDiscussionStateMessage: "Discussion removed successfully!" } });
      }
    } catch (error) {
      console.error("Error removing discussion:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotification = async () => {
    try {
      setLoadingNotification(true);
      const response = await DiscussApi.updateStatusNotificationDiscussionById({ discussionId: id });

      if (response) {
        setDiscussion(prevDiscussion => ({
          ...prevDiscussion,
          enableNotification: !prevDiscussion.enableNotification,
        }));
      }
    } catch (error) {
      console.error("Error updating status notification discussion:", error.message);
    } finally {
      setLoadingNotification(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setTooltipContent('Link Copied To Clipboard');
      setClicked(true);
      setTimeout(() => {
        setTooltipContent('Share');
        setClicked(false);
      }, 2000);
    });
  };

  // Phương thức nhận vào tên loại thông báo và trả về id của loại đó
  const getNotificationTypeIdByName = async (notificationName) => {
    try {
      // Gọi API để lấy danh sách các loại thông báo
      const { pagination, updatedNotificationTypes } = await NotificationApi.getNotificationTypes({ pageIndex: 1, pageSize: 15 });

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


  const handleVote = async (voteType) => {
    if (loadingVoteComment) return;
    setLoadingVoteComment(true);
    try {
      const response = await DiscussApi.createVoteDiscussion({
        discussionId: discussion.id,
        commentId: null,
        voteType: voteType,
        isActive: true,
      });


      if (response) {
        setVoteCount(prevCount => voteType === 'Like' ? prevCount + 1 : prevCount - 1);

        // Notification.
        const dataApiDiscussion = await DiscussApi.getDiscussionDetails(discussion.id);
        if (dataApiDiscussion && dataApiDiscussion.enableNotification) {
          const notificationTypeIdTmp = await getNotificationTypeIdByName('New Vote Discussion');
          // Sau khi tạo bình luận thành công, tạo lịch sử thông báo
          const notificationData = {
            userId: discussion.userId, // Lấy từ context hoặc props nếu cần
            notificationTypeId: notificationTypeIdTmp, // Loại thông báo
            userNotificationSettingId: userNotificationSettings, // Cài đặt thông báo của người dùng
            message: `
                  <div class="text-sm text-muted-foreground mb-2 break-words">
                  <p> <strong>${fullNameCurrentUser}</strong> Voted your post.</p>
                  <p><a href="/discussion/${discussion.id}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: normal; font-size: 0.875rem;">Click here to view the discussion.</a></p>
                  </div> `,
            sentVia: 'Web', // Hoặc 'Email' nếu cần
            status: 'Sent', // Trạng thái gửi
          };
          // Gọi API để tạo lịch sử thông báo
          const response = await NotificationApi.createNotificationHistory(notificationData);
        }
      }
    } catch (error) {
      //console.error(error);
    } finally {
      setLoadingVoteComment(false);
    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleDialogCancel = () => {
    setOpenDialog(false);
    setNewPost({
      id: discussion.id,
      categoryId: discussion.categoryId || "",
      title: discussion.title || "",
      content: discussion.description || "",
      tags: discussion.tags || [],
      image: discussion.image || { fileName: "", base64Image: "", contentType: "image/png" },
      isActive: discussion.isActive !== undefined ? discussion.isActive : true,
    });
  };

  const handleErrorDialogClose = () => setOpenErrorDialog(false);

  const handlePostSubmit = async () => {
    if (!newPost.categoryId || !newPost.title || !newPost.content || !newPost.tags.length) {
      setErrorMessage("Please fill in all required fields: Category, Tag, Title, Description.");
      setOpenErrorDialog(true);
      return;
    }

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
      enableNotification: discussion.enableNotification,
    };

    if (newPost.image && newPost.image.fileName && newPost.image.base64Image && newPost.image.contentType) {
      updateDiscussionDto.imageDto = {
        fileName: newPost.image.fileName,
        base64Image: newPost.image.base64Image,
        contentType: newPost.image.contentType,
      };
    }

    try {
      const response = await DiscussApi.updateDiscuss(updateDiscussionDto);
      if (response) {
        handleDialogClose();
        setReloadComponentCurrent(!reloadComponentCurrent);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMessage("Failed to update post. Please try again.");
      setOpenErrorDialog(true);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setNewPost({ ...newPost, content: text });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setNewPost({
        ...newPost,
        tags: [...newPost.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete) => () => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const tagContainerStyle = newPost.tags.length > 3 ? 'gap-2' : 'gap-1';

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-[#32679b] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center text-red-600 text-xl">
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }


  if (error || ((!isOwnerDiscussion || !currentUser) && !currentStatusDiscussion)) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center text-red-600 text-xl">
            {/* <p>{"The discussion has been deleted or you do not have permission to view this discussion."}</p> */}
            <p>{"This discussion does not exist."}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen pt-20 pb-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-lg overflow-hidden"
            style={{ boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.1)' }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => navigate("/discussions/discuss")}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center text-sm"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="mr-2 h-4 w-4" />
                  <span>Back to Discussions</span>
                </button>
                <div className="flex items-center space-x-4">
                  <Tooltip title={tooltipContent} arrow>
                    <IconButton
                      onClick={copyToClipboard}
                      className={`${clicked ? 'text-blue-500' : 'text-gray-500'} p-1`}
                      size="small"
                    >
                      <FontAwesomeIcon icon={faShareFromSquare} className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  {isOwnerDiscussion && (
                    <>
                      <Tooltip title={discussion.enableNotification ? "Disable notifications" : "Enable notifications"} arrow>
                        <IconButton
                          onClick={handleToggleNotification}
                          disabled={loadingNotification}
                          className={`${discussion.enableNotification ? 'text-green-500' : 'text-gray-500'} p-1`}
                          size="small"
                        >
                          <FontAwesomeIcon icon={discussion.enableNotification ? faBell : faBellSlash} className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit discussion" arrow>
                        <IconButton
                          onClick={() => setOpenDialog(true)}
                          className="text-blue-500 p-1"
                          size="small"
                        >
                          <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete discussion" arrow>
                        <IconButton
                          onClick={handleRemoveClick}
                          disabled={loading}
                          className="text-red-500 p-1"
                          size="small"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {/* <Tooltip title="Bookmark" arrow>
                    <IconButton
                      className="text-yellow-500 p-1"
                      size="small"
                    >
                      <FontAwesomeIcon icon={faBookmark} className="h-4 w-4" />
                    </IconButton>
                  </Tooltip> */}
                  <Tooltip title="Go to comments" arrow>
                    <IconButton
                      onClick={() => commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-gray-500 p-1"
                      size="small"
                    >
                      <FontAwesomeIcon icon={faComment} className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-4">
                <div className="flex items-start mb-6">
                  <img
                    src={discussion?.urlProfilePicture || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{discussion?.firstName} {discussion?.lastName}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      <span className="mr-4">Author</span>
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      <span>{formatDate(discussion?.dateCreated)}</span>
                      <FontAwesomeIcon icon={faEye} className="ml-4 mr-2" />
                      <span>{currentView} views</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start mb-2 mt-2">
                  <div className="flex flex-col items-center mr-4 mt-1">
                    <button
                      onClick={() => handleVote('Like')}
                      disabled={loadingVoteComment}
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faChevronUp} className="text-xl" />
                    </button>
                    <span className="font-bold text-lg my-1">{voteCount}</span>
                    <button
                      onClick={() => handleVote('Dislike')}
                      disabled={loadingVoteComment}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faChevronDown} className="text-xl" />
                    </button>
                  </div>
                  <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{discussion?.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion?.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-black"
                        >
                          <FontAwesomeIcon icon={faTag} className="mr-2 h-3 w-3 text-black" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      className="prose max-w-none text-gray-800 text-base overflow-hidden"
                      components={{
                        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                      }}
                    >
                      {discussion?.description}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              {discussion?.imageUrl && (
                <div className="mt-6 mb-6 max-w-[80%] mx-auto">
                  <img
                    src={discussion.imageUrl}
                    alt="Discussion"
                    className="w-full h-auto object-cover rounded-lg max-h-[400px]"
                  />
                </div>
              )}
            </div>
          </div>

          <div ref={commentSectionRef} className="mt-2">
            <CommentList discussionId={id} userIdDiscussion={discussion?.userId} />
          </div>
        </div>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(10, 25, 47, 0.2)',
          },
        }}
      >
        <DialogTitle className="bg-[#32679b] text-white text-2xl font-bold py-6 px-8 border-b border-[#1e3a5f]">
          Update Post
        </DialogTitle>
        <DialogContent className="p-8 bg-[#f8f8f8]">
          <div className="space-y-6 pt-5">
            <div className="space-y-3">
              <Select
                fullWidth
                value={newPost.categoryId}
                onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
                displayEmpty
                className="bg-white rounded-md shadow-sm border border-gray-300 focus:border-[#32679b] focus:ring focus:ring-[#32679b] focus:ring-opacity-50 "
              >
                <MenuItem value="" disabled>Select Category</MenuItem>
                {categories.filter(category => category.isActive).map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>

              <TextField
                fullWidth
                label="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="bg-white rounded-md shadow-sm"
                variant="outlined"
                InputProps={{
                  style: { borderColor: '#32679b' }
                }}
              />
            </div>

            <div className="space-y-1">
              <TextField
                fullWidth
                label="Tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                className="bg-white rounded-md shadow-sm mb-2"
                variant="outlined"
                InputProps={{
                  style: { borderColor: '#32679b' }
                }}
                helperText="Press Enter to add a tag"
              />
              <div className={`flex flex-wrap ${tagContainerStyle}`}>
                {newPost.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    icon={<FontAwesomeIcon icon={faTag} style={{ color: '#32679b' }} />}
                    label={tag}
                    onDelete={handleTagDelete(tag)}
                    style={{
                      backgroundColor: '#e5e7eb',
                      color: '#32679b',
                      margin: '0 4px 8px 0'
                    }}
                    deleteIcon={
                      <FontAwesomeIcon
                        icon={faTimes}
                        style={{ color: '#32679b' }}
                        className="hover:text-red-500 transition-colors duration-200"
                      />
                    }
                  />
                ))}
              </div>
            </div>

            <div className="border border-[#32679b] rounded-md overflow-hidden">
              <MarkdownEditor
                value={newPost.content}
                onChange={handleEditorChange}
                style={{ height: "300px" }}
                renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                className="prose max-w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faImage} className="text-[#32679b] text-xl" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewPost({
                        ...newPost,
                        image: {
                          fileName: file.name,
                          base64Image: reader.result.split(',')[1],
                          contentType: file.type,
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#32679b] file:text-white hover:file:bg-[#1e3a5f] transition-colors duration-200"
              />
            </div>
          </div>
          <style jsx>{`
            .dialog-content-wrapper > * {
              margin-bottom: 1.5rem;
            }
            .dialog-content-wrapper > *:last-child {
              margin-bottom: 0;
            }
          `}</style>
        </DialogContent>
        <DialogActions className="bg-[#f8f8f8] py-4 px-8 border-t border-gray-200">
          <Button
            onClick={handleDialogCancel}
            className="px-6 py-2 rounded-md text-[#1e3a5f] hover:bg-gray-200 transition-colors duration-200"
            style={{ color: '#32679b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePostSubmit}
            variant="contained"
            className="px-6 py-2 rounded-md bg-[#32679b] text-white hover:bg-[#1e3a5f] transition-colors duration-200"
            style={{ backgroundColor: '#32679b' }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={handleErrorDialogClose}>
        <DialogTitle className="bg-red-100 text-red-800">Error</DialogTitle>
        <DialogContent>
          <p className="text-red-600 mt-2">{errorMessage}</p>
        </DialogContent>
        <DialogActions className="bg-gray-50">
          <Button onClick={handleErrorDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      {showAlert && (
        <div className="fixed inset-x-0 top-0 flex items-center justify-center z-50 mt-4">
          <Alert
            severity="success"
            className="shadow-lg"
          >
            Post updated successfully!
          </Alert>
        </div>
      )}
    </Layout>
  );
}

export default DiscussionDetail;

