/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Smile,
  AtSign,
  ThumbsUp,
  ThumbsDown,
  MessageSquareReply
} from 'lucide-react'

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
    <form onSubmit={handleSubmit} className='bg-white p-4 border-t sticky'>
      <div className='bg-gray-100 rounded-lg p-2'>
        <textarea
          placeholder='Add comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='w-full bg-transparent outline-none resize-none'
          rows='2'
        />
        <div className='flex justify-between items-center mt-2'>
          <div className='flex space-x-2'>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <Bold size={20} />
            </button>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <Italic size={20} />
            </button>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <Underline size={20} />
            </button>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <Link size={20} />
            </button>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <Image size={20} />
            </button>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <Smile size={20} />
            </button>
            <button type='button' className='text-gray-500 hover:text-gray-700'>
              <AtSign size={20} />
            </button>
          </div>
          <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600'>
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

const Comment = ({ author, avatar, content, timestamp, likes, dislikes }) => (
  <div className='flex space-x-3 p-4 border-b rounded-2xl bg-[#9ac0e7] mb-3'>
    <img src={avatar} alt={author} className='w-10 h-10 rounded-full' />
    <div className='flex-1'>
      <div className='flex items-center space-x-2'>
        <span className='font-semibold'>{author}</span>
        <span className='text-gray-500 text-sm'>{timestamp}</span>
      </div>
      <p className='mt-1'>{content}</p>
      <div className='flex items-center space-x-4 mt-2'>
        <button className='flex items-center space-x-1 text-gray-500 hover:text-gray-700'>
          <span>
            <ThumbsUp size={16} color='#d65757' absoluteStrokeWidth />
          </span>
          <span>{likes}</span>
        </button>
        <button className='flex items-center space-x-1 text-gray-500 hover:text-gray-700'>
          <span>
            <ThumbsDown size={16} />
          </span>
          <span>{dislikes}</span>
        </button>
        <button className='text-gray-500 hover:text-gray-700'>
          <MessageSquareReply className='inline-block mr-1' size={16} /> Reply
        </button>
      </div>
    </div>
  </div>
)

export default function Comments() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Noah Pierre',
      avatar:
        'https://cdn.dribbble.com/userupload/12534979/file/original-9ecb2818b2aa33560d07d77b5c69544d.png?resize=1024x768',
      content: "I'm a bit unclear about how condensation forms in the water cycle. Can someone break it down?",
      timestamp: '58 minutes ago',
      likes: 25,
      dislikes: 3
    },
    {
      id: 2,
      author: 'Skill Sprout',
      avatar:
        'https://cdn.dribbble.com/userupload/12534979/file/original-9ecb2818b2aa33560d07d77b5c69544d.png?resize=1024x768',
      content:
        "Condensation happens when water vapor cools down and changes back into liquid droplets. It's the step before precipitation. The example with the glass of ice water in the video was a great visual!",
      timestamp: '8 minutes ago',
      likes: 2,
      dislikes: 0
    },
    {
      id: 3,
      author: 'Mollie Hall',
      avatar:
        'https://cdn.dribbble.com/userupload/12534979/file/original-9ecb2818b2aa33560d07d77b5c69544d.png?resize=1024x768',
      content:
        "I really enjoyed today's lesson on the water cycle! The animations made the processes so much easier to grasp.",
      timestamp: '5 hours ago',
      likes: 0,
      dislikes: 0
    }
  ])

  const addComment = (content) => {
    const newComment = {
      id: comments.length + 1,
      author: 'Current User',
      avatar: '/placeholder.svg?height=40&width=40',
      content,
      timestamp: 'Just now',
      likes: 0,
      dislikes: 0
    }
    setComments([newComment, ...comments])
  }

  return (
    <div className='mx-auto bg-white rounded-lg shadow-md'>
      <CommentInput onSubmit={addComment} />
      <div className='h-[calc(100vh-120px)] overflow-y-auto'>
        <div className='p-4 border-b'>
          <h2 className='text-xl font-semibold flex items-center'>
            Comments{' '}
            <span className='ml-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-full'>{comments.length}</span>
          </h2>
        </div>
        <div className='p-4'>
          <div className=''>
            {comments.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))}
          </div>
          <div className='text-center'>
            <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600'>
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
