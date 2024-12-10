import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faEye,
  faChevronUp,
  faSearch,
  faPlus,
  faFire,
  faClock,
  faVoteYea,
  faTag,
  faUser,
  faCalendarAlt,
  faPaperclip,
  faImage,
  faComments,
  faTimes,
  faExclamationTriangle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from 'date-fns';
import { DiscussApi } from "@/services/api/DiscussApi";
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Select, MenuItem, Typography, Chip } from '@mui/material';
import MarkdownIt from "markdown-it";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { motion } from "framer-motion";
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import AuthService from '../../oidc/AuthService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { debounce } from 'lodash';

function PostList({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState("hot");
  const [tags, setTags] = useState("");
  const [keySearch, setKeySearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3,
    totalCount: 0,
    totalPages: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newPost, setNewPost] = useState({
    categoryId: "",
    title: "",
    content: "",
    tags: [],
    image: { fileName: "", base64Image: "", contentType: "image/png" },
    isActive: true
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertCheckIsNewPost, setShowAlertCheckIsNewPost] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuthor] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState({});

  const [tagInput, setTagInput] = useState('');
  const tagContainerStyle = newPost.tags.length > 3 ? 'gap-2' : 'gap-1';

  const fetchPosts = useCallback(async () => {
    setSearchLoading(true);
    setLoading(true);
    setError(null);
    try {
      const data = await DiscussApi.getDiscussionOptions({
        discussionId: categoryId,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        orderBy,
        keySearch: keySearch.trim(),
        tags: selectedTags.join(','),
      });

      //console.log("API response:", data);

      if (data && data.updatedDiscussions) {
        setPosts(data.updatedDiscussions);

        if (data.pagination) {
          setPagination(prevPagination => ({
            ...prevPagination,
            ...data.pagination,
            totalPages: Math.ceil(data.pagination.totalCount / data.pagination.pageSize),
          }));
        }
      } else {
        setPosts([]);
        setPagination(prev => ({ ...prev, totalCount: 0, totalPages: 0, pageIndex: 1 }));
      }

      const categoriesData = await DiscussApi.getCategories();
      if (categoriesData && categoriesData.categoryDtos) {
        setCategories(categoriesData.categoryDtos);
      } else {
        setCategories([]);
      }

      const userTmp = await AuthService.getUser();
      setCurrentUser(userTmp);
      setIsAuthor(!!userTmp?.profile.sub);

    } catch (err) {
      //console.error("Error fetching posts:", err);
      //setError("Failed to fetch posts. Please try again later.");
      setPosts([]);
      setPagination(prev => ({ ...prev, totalCount: 0, totalPages: 0, pageIndex: 1 }));
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  }, [categoryId, pagination.pageIndex, pagination.pageSize, orderBy, keySearch, selectedTags]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, selectedTags]); // Updated useEffect

  const handlePostClick = (postId) => {
    navigate(`/discussion/${postId}`);
  };

  const handleTagClick = (tag, e) => {
    e.stopPropagation();
    handleTagSelect(tag);
  };

  const handleTagSelect = (tag) => {
    setSelectedTags(prevTags => {
      const newTags = prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag];
      return newTags;
    });
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleFilterClick = (filter) => {
    if (filter !== orderBy) {
      setOrderBy(filter);
      setPagination(prev => ({ ...prev, pageIndex: 1 }));
    }
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: value,
    }));
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInTime = now - date;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    if (diffInDays >= 7) {
      return formatDate(dateString);
    }

    const distance = formatDistanceToNow(date, { addSuffix: true });
    return distance;
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
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


  const handleDialogCancel = () => {
    setNewPost({
      categoryId: "",
      title: "",
      content: "",
      tags: [],
      image: { fileName: "", base64Image: "", contentType: "image/png" },
      isActive: true
    });
    setOpenDialog(false);
  };

  const handleErrorDialogClose = () => {
    setOpenErrorDialog(false);
  };

  const handlePostSubmit = async () => {
    if (!newPost.categoryId || !newPost.title || !newPost.content || !newPost.tags) {
      setErrorMessage("Please fill in all data: Category, Tag, Topic, Description post before submitting.");
      setOpenErrorDialog(true);
      setTimeout(() => {
        setOpenErrorDialog(false);
      }, 30000);
      return;
    }

    const discussionData = {
      categoryId: newPost.categoryId,
      title: newPost.title,
      description: newPost.content,
      tags: newPost.tags,
      isActive: newPost.isActive,
    };

    if (newPost.image.fileName && newPost.image.base64Image && newPost.image.contentType) {
      discussionData.image = {
        fileName: newPost.image.fileName,
        base64Image: newPost.image.base64Image,
        contentType: newPost.image.contentType,
      };
    } else {
      discussionData.image = null;
    }

    try {
      const response = await DiscussApi.createDiscuss(discussionData);
      console.log("Post created successfully:", response);
      if (response) {
        setNewPost({
          categoryId: "",
          title: "",
          content: "",
          tags: [],
          image: { fileName: "", base64Image: "", contentType: "image/png" },
          isActive: true
        });
        handleDialogClose();
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Failed to create post. Please try again.");
      setOpenErrorDialog(true);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setNewPost({ ...newPost, content: text });
  };

  const handleNewPostButtonClick = () => {
    if (isAuth) {
      setOpenDialog(true);
    } else {
      setShowAlertCheckIsNewPost(true);
      setTimeout(() => setShowAlertCheckIsNewPost(false), 5000);
    }
  };

  const truncateDescription = (description, maxLength = 300) => {
    if (description.length <= maxLength) return description;

    const lastSpace = description.lastIndexOf(' ', maxLength);
    const truncateIndex = lastSpace > 0 ? lastSpace : maxLength;

    return description.slice(0, truncateIndex) + '...';
  };

  const togglePostExpansion = (postId, e) => {
    e.stopPropagation();
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const renderDescription = (description, postId) => {
    const isExpanded = expandedPosts[postId];
    const truncatedDescription = isExpanded ? description : truncateDescription(description);

    return (
      <>
        <div className="mb-4 text-gray-700 prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {truncatedDescription}
          </ReactMarkdown>
        </div>
        {description.length > 300 && (
          <button
            onClick={(e) => togglePostExpansion(postId, e)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </>
    );
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.length >= 3 || value.length === 0) {
        setKeySearch(value);
        setPagination(prev => ({ ...prev, pageIndex: 1 }));
      }
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const { name, value } = e.target;
    if (name === 'keySearch') {
      setInputSearch(value);
      debouncedSearch(value);
    } else if (name === 'tags') {
      setTags(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      newTags.forEach(tag => {
        if (!selectedTags.includes(tag)) {
          handleTagSelect(tag);
        }
      });
      setTags('');
    }
  };

  useEffect(() => {
    //console.log('Selected tags:', selectedTags);
  }, [selectedTags]);

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 shadow-lg">
      <div className="max-w-8xl mx-auto bg-white rounded-lg p-4 sm:p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            {['hot', 'newest', 'mostvotes'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center ${orderBy === filter
                  ? "bg-[#32679b] text-white"
                  : "bg-gray-200 text-[#6b7280] hover:bg-gray-300"
                  }`}
                onClick={() => handleFilterClick(filter)}
              >
                <FontAwesomeIcon icon={
                  filter === 'hot' ? faFire :
                    filter === 'newest' ? faClock :
                      faVoteYea
                } className="mr-2" />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="bg-[#32679b] text-white px-6 py-2 rounded-md hover:bg-[#285580] transition-colors duration-200 flex items-center whitespace-nowrap shadow-md"
            onClick={handleNewPostButtonClick}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Post
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-grow min-w-[200px]">
            <input
              type="text"
              name="keySearch"
              placeholder="Search title or description"
              value={inputSearch}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative flex-grow">
            <div className="flex items-center p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 h-[42px] overflow-x-auto">
              <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-2 flex-shrink-0" />
              <div className="flex items-center gap-2 flex-grow overflow-x-auto">
                {selectedTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagRemove(tag)}
                    className="bg-[#32679b] text-white text-xs flex-shrink-0"
                    deleteIcon={<FontAwesomeIcon icon={faTimes} className="text-white text-xs" />}
                  />
                ))}
                <input
                  type="text"
                  name="tags"
                  placeholder={selectedTags.length > 0 ? "Add more tags (comma or Enter)" : "Enter tags (comma or Enter)"}
                  value={tags}
                  onChange={handleSearch}
                  onKeyDown={handleKeyDown}
                  className="outline-none bg-transparent text-sm min-w-[100px] flex-grow"
                />
              </div>
            </div>
          </div>
        </div>

        {(loading || searchLoading) ? (
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
        ) : (
          <>
            {showAlertCheckIsNewPost && (
              <Alert severity="error" className="mb-4">
                Please log in to create a new post!
              </Alert>
            )}

            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="h6" color="textSecondary">
                  There aren't any discussion topics here yet!
                </Typography>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#32679b', color: 'white', marginTop: '1rem' }}
                  startIcon={<EditIcon />}
                  onClick={handleNewPostButtonClick}
                >
                  Create New Post
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={post.urlProfilePicture || "/placeholder.svg"}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full mr-4 border-2 border-[#32679b] object-cover"
                        />
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-[#0a192f] flex items-center">
                            {post.pinned && (
                              <FontAwesomeIcon icon={faThumbtack} className="text-[#32679b] mr-2" />
                            )}
                            {post.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <FontAwesomeIcon icon={faUser} className="mr-1 text-[#6b7280]" />
                            <span className="font-medium text-[#0a192f] mr-2">{post.firstName} {post.lastName}</span>
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 ml-2 text-[#6b7280]" />
                            <span>Created: {formatRelativeDate(post.dateCreated)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 flex items-center cursor-pointer ${selectedTags.includes(tag)
                              ? "bg-[#555b66] text-white"
                              : "bg-gray-200 text-[#646a75] hover:bg-gray-300"
                              }`}
                            onClick={(e) => handleTagClick(tag, e)}
                          >
                            <FontAwesomeIcon icon={faTag} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      {renderDescription(post.description, post.id)}
                      <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4 mt-4">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="mr-1 text-[#6b7280]" />
                          <span>Updated: {formatRelativeDate(post.dateUpdated)}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faChevronUp} className="mr-1 text-emerald-500" />
                            {post.voteCount}
                          </span>
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faEye} className="mr-1 text-indigo-500" />
                            {post.viewCount}
                          </span>
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faComments} className="mr-1 text-[#3e79b2]" />
                            {post.commentCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && posts.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="text-sm text-gray-700 mb-2">
              Showing {Math.min((pagination.pageIndex - 1) * pagination.pageSize + 1, pagination.totalCount)} - {Math.min(pagination.pageIndex * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} posts
            </div>
            <div className="flex justify-center items-center space-x-1">
              {[
                { label: 'First', onClick: () => handlePageChange(null, 1), disabled: pagination.pageIndex === 1 },
                { label: 'Prev', onClick: () => handlePageChange(null, pagination.pageIndex - 1), disabled: pagination.pageIndex === 1 },
                ...Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                  const pageNumber = pagination.pageIndex + i - Math.min(2, pagination.pageIndex - 1);
                  if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
                    return {
                      label: pageNumber,
                      onClick: () => handlePageChange(null, pageNumber),
                      current: pageNumber === pagination.pageIndex
                    };
                  }
                  return null;
                }).filter(Boolean),
                { label: 'Next', onClick: () => handlePageChange(null, pagination.pageIndex + 1), disabled: pagination.pageIndex === pagination.totalPages },
                { label: 'Last', onClick: () => handlePageChange(null, pagination.totalPages), disabled: pagination.pageIndex === pagination.totalPages }
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled || loading}
                  className={`min-w-0 px-3 py-2 text-sm font-medium rounded-md ${button.current
                    ? 'bg-[#32679b] text-white'
                    : 'text-[#32679b] border border-[#32679b] hover:bg-[#32679b] hover:text-white'
                    } ${button.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="lg" className="dialog-submit-container">
          <DialogTitle className="dialog-submit-title bg-[#32679b] text-white">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Post
          </DialogTitle>
          <DialogContent className="dialog-submit-content mt-4">
            <Select
              label="Category"
              fullWidth
              value={newPost.categoryId || ""}
              onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
              margin="normal"
              variant="outlined"
              className="dialog-submit-select mb-4"
            >
              <MenuItem value="">Select One Category</MenuItem>
              {categories && Array.isArray(categories) && categories.filter(category => category.isActive).map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Title"
              fullWidth
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              margin="normal"
              variant="outlined"
              className="dialog-submit-textfield mb-2"
              InputProps={{
                startAdornment: (
                  <FontAwesomeIcon icon={faPaperclip} className="mr-2 text-gray-400" />
                ),
              }}
            />

            <div className="space-y-2">
              <TextField
                fullWidth
                label="Tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                className="bg-white rounded-md shadow-sm mb-2 top-2"
                variant="outlined"
                InputProps={{
                  style: { borderColor: '#32679b' },
                  startAdornment: (
                    <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-400" />
                  ),
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

            <MarkdownEditor
              value={newPost.content}
              style={{ height: "200px", marginBottom: "16px" }}
              onChange={handleEditorChange}
              renderHTML={(text) => {
                const md = new MarkdownIt();
                return md.render(text);
              }}
            />

            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faImage} className="mr-2 text-gray-400" />
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
            </div>
          </DialogContent>
          <DialogActions className="dialog-submit-actions bg-gray-100">
            <Button onClick={handleDialogCancel} className="dialog-submit-btn-cancel text-[#32679b]"
              style={{ color: '#32679b' }}
            >
              Cancel
            </Button>
            <Button onClick={handlePostSubmit} variant="contained" className="dialog-submit-btn-submit" style={{ backgroundColor: '#32679b' }}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openErrorDialog}
          onClose={handleErrorDialogClose}
          fullWidth
          maxWidth="sm"
          className="dialog-error-container"
        >
          <DialogTitle className="dialog-error-title bg-red-600 text-white py-3 px-6 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-2xl" />
            <span className="text-xl font-semibold">Error Creating Post</span>
          </DialogTitle>
          <DialogContent className="mt-4 px-6 py-4">
            <p className="text-gray-700 text-base">{errorMessage}</p>
          </DialogContent>
          <DialogActions className="bg-gray-100 px-6 py-3">
            <Button
              onClick={handleErrorDialogClose}
              className="bg-[#32679b] text-white hover:bg-[#cccccc] px-6 py-2 rounded-md text-base font-medium transition-colors duration-200">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {showAlert && (
          <Alert severity="success" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 border border-green-300">
            Create New Post Successfully!
          </Alert>
        )}
      </div>
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .h-[42px] {
          max-width: 300px;
        }
        @media (max-width: 640px) {
          .mb-6.flex.justify-between.items-center {
            flex-direction: column;
            align-items: stretch;
          }
          .mb-6.flex.justify-between.items-center > div,
          .mb-6.flex.justify-between.items-center > button {
            margin-bottom: 1rem;
          }
          .mb-6.flex.flex-wrap.items-center.gap-4 > div {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default PostList;

