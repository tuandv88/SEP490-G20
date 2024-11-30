import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import AuthService from './AuthService'
import { Loading } from '@/components/ui/overlay'

function Callback() {
  console.log('Callback method....')

  const navigate = useNavigate()

  useEffect(() => {
    AuthService.handleCallback()
      .then(() => {
        console.log('Verify Auth Code - Get Access_Token & Save Storage..')
        navigate({ to: '/' })
      })
      .catch((error) => {
        console.error('Error handling callback:', error)
        console.error('Verify Auth Code Failed.')
        navigate({ to: '/' })
      })
  }, [navigate])

  // Tạo phần tử React mà không dùng JSX
  return React.createElement(Loading)
}

export default Callback
