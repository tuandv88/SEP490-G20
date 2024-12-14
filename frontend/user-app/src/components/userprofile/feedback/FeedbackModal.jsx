import React, { useState } from 'react'
import { Star, StarOff, Send, Sparkles, X } from 'lucide-react'
import { CourseAPI } from '@/services/api/courseApi'

export function FeedbackModal({ isOpen, onClose, setIsFeedbackSuccess, courseId, existingRating, existingFeedback, readOnly = false }) {
  const [rating, setRating] = useState(existingRating || 0)
  const [feedback, setFeedback] = useState(existingFeedback || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await CourseAPI.feedbackCourse(courseId, {
        courseReview: {
          rating,
          feedback
        }
      })
      console.log(response)
      setIsSuccess(true)
      setIsFeedbackSuccess(true)
      setTimeout(() => {
        setRating(0)
        setFeedback('')
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // const feedBackCourse = async (data) => {
  //   console.log(data)
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve({ success: true })
  //     }, 1000)
  //   })
  // }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 relative animate-fade-in-up'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X className='w-6 h-6' />
        </button>

        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>Your Feedback</h2>
          <p className='text-gray-600'>
            {readOnly ? 'Your previous feedback' : 'Help us improve your learning experience'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='bg-gray-50 p-6 rounded-xl'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>How would you rate this course?</label>
            <div className='flex justify-center gap-3 mb-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onMouseEnter={() => !readOnly && setHoverRating(star)}
                  onMouseLeave={() => !readOnly && setHoverRating(0)}
                  onClick={() => !readOnly && handleStarClick(star)}
                  className={`focus:outline-none transition-all duration-200 ${!readOnly && 'hover:scale-110'}`}
                  disabled={readOnly}
                >
                  {star <= (hoverRating || rating) ? (
                    <Star className='w-10 h-10 fill-yellow-400 text-yellow-400 drop-shadow-sm' />
                  ) : (
                    <StarOff className='w-10 h-10 text-gray-300' />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='feedback' className='block text-sm font-medium text-gray-700'>
              Share your thoughts
            </label>
            <textarea
              id='feedback'
              value={feedback}
              onChange={(e) => !readOnly && setFeedback(e.target.value)}
              rows={4}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none'
              placeholder='What did you like? What could be improved?'
              readOnly={readOnly}
            />
          </div>

          {!readOnly && (
            <button
              type='submit'
              disabled={isSubmitting || rating === 0 || !feedback.trim()}
              className={`w-full py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${
                  isSubmitting || rating === 0 || !feedback.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className='w-5 h-5' />
                  Submit Feedback
                </>
              )}
            </button>
          )}

          {isSuccess && (
            <div className='mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center animate-fade-in flex items-center justify-center gap-2'>
              <Sparkles className='w-5 h-5' />
              <span>Thank you for your valuable feedback!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
