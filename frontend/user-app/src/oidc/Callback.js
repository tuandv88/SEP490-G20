import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from './AuthService'

function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    AuthService.handleCallback()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
        console.error('Error handling callback:', error)
      })
  }, [navigate])

  return <div>Loading...</div>
}

export default Callback