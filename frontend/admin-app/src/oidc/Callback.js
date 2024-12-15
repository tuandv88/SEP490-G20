import React, { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import AuthService from './AuthService'
import { DASHBOARD_PATH } from '@/routers/router'
import { Loading } from '@/components/overlay'

function Callback() {
  console.log('Callback method....')

  const navigate = useNavigate()
  useEffect(() => {
    AuthService.handleCallback()
      .then(() => {
        navigate({ to: DASHBOARD_PATH })
      })
      .catch((error) => {
        console.error('Error handling callback:', error)
        console.error('Verify Auth Code Failed.')
        navigate({ to: '/' })
      })
  }, [navigate])

  return React.createElement(Loading)
}

export default Callback
