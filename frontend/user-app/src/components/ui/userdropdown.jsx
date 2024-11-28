import { UserContext } from '@/contexts/UserContext'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import authServiceInstance from '@/oidc/AuthService'
import { useContext, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DropdownMenuUser({ isOpen, userName, onClose }) {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen || !user || !user.profile) return null

  return (
    <div
      ref={dropdownRef}
      className='absolute right-0 mt-6 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none'
      role='menu'
      aria-orientation='vertical'
      aria-labelledby='options-menu'
    >
      <div className='px-4 py-3'>
        <div className='flex items-center'>
          <img
            className='w-10 h-10 mr-3 rounded-full'
            src={user.profile.urlImagePresigned}
            alt=''
          />
          <div>
            <p className='text-sm font-medium text-gray-900'>{userName}</p>
          </div>
        </div>
      </div>

      <div className='py-1'>
        <button
          onClick={() => {
            navigate(AUTHENTICATION_ROUTERS.USERPROFILE)
            onClose()
          }}
          className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
        >
          My Profile
        </button>

        <button
          className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
        >
          Settings
        </button>

        <button
          onClick={() => {
            authServiceInstance.logout()
            onClose()
          }}
          className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
        >
          Sign out
        </button>
      </div>
    </div>
  )
}