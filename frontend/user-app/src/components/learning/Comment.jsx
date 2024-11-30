/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { CommentAPI } from '@/services/api/commentApi'
import ChapterLoading from '../loading/ChapterLoading'
import { UserAPI } from '@/services/api/userApi'
import { UserContext } from '@/contexts/UserContext'

const CommentInput = ({ onSubmit }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment)
      setComment('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='bg-[#1b2a32] p-4 border-t border-gray-700'>
      <div className='bg-[#243947] rounded-lg p-2'>
        <textarea
          placeholder='Add comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='w-full bg-transparent outline-none resize-none text-white placeholder-gray-400'
          rows={2}
        />
        <div className='flex justify-between items-center mt-2'>
          <button
            type='submit'
            className='bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 disabled:opacity-50'
            disabled={!comment.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

const Comment = ({ author, avatar, content, timestamp, isCurrentUser, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const handleUpdate = (e) => {
    e.preventDefault()
    onEdit(editContent) // Truyền editContent khi gọi onEdit
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(content)
  }

  return (
    <div className='flex space-x-3 p-4 border-b rounded-2xl bg-[#1b2a32] mb-3 text-white'>
      <img src={avatar} alt={author} className='w-10 h-10 rounded-full' />
      <div className='flex-1'>
        <div className='flex items-center space-x-2'>
          <span className='font-semibold'>{author}</span>
          <span className='text-gray-300 text-sm'>{timestamp}</span>
          {isCurrentUser && (
            <div className='flex space-x-2'>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='text-blue-300 hover:text-blue-200 hover:underline'
              >
                Edit
              </button>
              <button onClick={onDelete} className='text-red-300 hover:text-red-200 hover:underline'>
                Delete
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleUpdate} className='mt-2'>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className='w-full p-2 border rounded-lg bg-[#243947] text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
            />
            <div className='flex justify-end space-x-2 mt-2'>
              <button
                type='button'
                onClick={handleCancel}
                className='px-3 py-1 text-sm text-gray-300 hover:text-gray-100'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
                disabled={!editContent.trim()}
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className='mt-1'>{content}</p>
        )}
      </div>
    </div>
  )
}

export default function Comments({ lectureId, courseId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const fetchComment = async () => {
      setLoading(true)
      try {
        const response = await CommentAPI.getCommentLecture(lectureId, 1, 10)
        const commentsWithUserDetails = await Promise.all(
          response.comments.data.map(async (comment) => {
            const userResponse = await UserAPI.getUserById(comment.userId)
            const user = userResponse
            return {
              ...comment,
              userName: user.firstName + ' ' + user.lastName,
              avatar: user.urlProfilePicture
            }
          })
        )
        setComments(commentsWithUserDetails)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComment()
  }, [lectureId])

  const addComment = async (content) => {
    try {
      const newCommentId = await CommentAPI.addComment(courseId, lectureId, content)
      const newComment = {
        id: newCommentId,
        userId: user.profile.sub,
        comment: content,
        lastModified: new Date().toISOString(),
        userName: user.profile.firstName + ' ' + user.profile.lastName,
        avatar: user.profile.urlImagePresigned
      }
      setComments([newComment, ...comments])
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await CommentAPI.deleteComment(courseId, lectureId, commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const editComment = async (commentId, newContent) => {
    try {
      await CommentAPI.updateComment(courseId, lectureId, commentId, newContent)
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, comment: newContent } : comment)))
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  if (loading) {
    return <ChapterLoading />
  }

  return (
    <div className='mx-auto bg-[#1b2a32] rounded-lg shadow-md'>
      <CommentInput onSubmit={addComment} />

      {comments && comments.length > 0 ? (
        <div className='h-[calc(100vh-120px)] overflow-y-auto pb-[100px]'>
          <div className='p-4 border-b border-gray-700'>
            <h2 className='text-xl font-semibold flex items-center text-white'>
              Comments{' '}
              <span className='ml-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-full'>{comments.length}</span>
            </h2>
          </div>
          <div className='p-4'>
            <div className=''>
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  author={comment.userName}
                  avatar={comment.avatar}
                  content={comment.comment}
                  timestamp={new Date(comment.lastModified).toLocaleString()}
                  isCurrentUser={comment.userId === user.profile.sub}
                  onDelete={() => deleteComment(comment.id)}
                  onEdit={(newContent) => editComment(comment.id, newContent)}
                />
              ))}
            </div>
            <div className='text-center mb-[50px]'>
              <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600'>
                Load More
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='p-4'>
          <p className='text-center text-gray-300'>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
