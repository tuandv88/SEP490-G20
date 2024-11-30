import React, { useEffect, useState } from 'react'
import { X, Lightbulb, Code, Clock, Target } from 'lucide-react'
import authServiceInstance from '@/oidc/AuthService'
import { UserAPI } from '@/services/api/userApi'

const SurveyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    interest: '',
    motivation: '',
    background: '',
    timeCommitment: ''
  })


  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-2xl mx-4 relative'>
        <button onClick={onClose} className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'>
          <X className='w-6 h-6' />
        </button>

        <div className='p-6'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-800'>Start Your Programming Journey</h2>
            <p className='text-gray-600 mt-2'>Let's understand your goals and help you get started!</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors'>
              <div className='flex items-center gap-3 mb-3'>
                <Lightbulb className='w-5 h-5 text-blue-500' />
                <label className='text-lg font-medium text-gray-800'>Would you like to become a programmer?</label>
              </div>
              <select
                className='w-full border rounded-md p-2 bg-gray-50'
                value={formData.interest}
                onChange={(e) => setFormData((prev) => ({ ...prev, interest: e.target.value }))}
                required
              >
                <option value=''>Choose your answer</option>
                <option value='yes_sure'>Yes, I'm very interested!</option>
                <option value='maybe'>Maybe, I want to learn more about it</option>
                <option value='curious'>Just curious about programming</option>
                <option value='not_sure'>Not sure yet</option>
              </select>
            </div>

            <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors'>
              <div className='flex items-center gap-3 mb-3'>
                <Target className='w-5 h-5 text-blue-500' />
                <label className='text-lg font-medium text-gray-800'>What motivates you to learn programming?</label>
              </div>
              <select
                className='w-full border rounded-md p-2 bg-gray-50'
                value={formData.motivation}
                onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                required
              >
                <option value=''>Select your motivation</option>
                <option value='career'>I want a career in technology</option>
                <option value='create'>I want to create my own apps/websites</option>
                <option value='curiosity'>I'm curious about how programs work</option>
                <option value='hobby'>I want a new hobby</option>
              </select>
            </div>

            <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors'>
              <div className='flex items-center gap-3 mb-3'>
                <Code className='w-5 h-5 text-blue-500' />
                <label className='text-lg font-medium text-gray-800'>Have you ever tried programming before?</label>
              </div>
              <select
                className='w-full border rounded-md p-2 bg-gray-50'
                value={formData.background}
                onChange={(e) => setFormData((prev) => ({ ...prev, background: e.target.value }))}
                required
              >
                <option value=''>Select your experience</option>
                <option value='never'>Never tried programming before</option>
                <option value='little'>Tried a little bit (few hours)</option>
                <option value='some'>Done some tutorials</option>
                <option value='basics'>Know the basics</option>
              </select>
            </div>

            <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors'>
              <div className='flex items-center gap-3 mb-3'>
                <Clock className='w-5 h-5 text-blue-500' />
                <label className='text-lg font-medium text-gray-800'>
                  How much time can you spend learning each week?
                </label>
              </div>
              <select
                className='w-full border rounded-md p-2 bg-gray-50'
                value={formData.timeCommitment}
                onChange={(e) => setFormData((prev) => ({ ...prev, timeCommitment: e.target.value }))}
                required
              >
                <option value=''>Select time commitment</option>
                <option value='few_hours'>A few hours</option>
                <option value='5_hours'>About 5 hours</option>
                <option value='10_hours'>About 10 hours</option>
                <option value='more'>More than 10 hours</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg'
            >
              Start My Journey
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SurveyModal
