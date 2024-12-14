import React, { useContext } from 'react'
import { LogOut } from 'lucide-react'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'
import { ProfileTabs } from './ProfileTabs'

export function ProfileLayout({ children, activeTab, setActiveTab }) {
  const { user } = useContext(UserContext)

  return (
    <div className='min-h-screen bg-white mt-[75px]'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 mr-10 ml-20'>
        {/* Thông tin người dùng */}

        {/* Bố cục flex với sidebar và nội dung */}
        <div className='flex'>
          {/* Sidebar bên trái */}

          <div className='w-1/5'>
            <div className='flex items-center mb-8'>
              <div className='flex items-center space-x-4'>
                <div className='h-16 w-16 rounded-full bg-primaryButton flex items-center justify-center text-white text-2xl font-bold'>
                  {user?.profile?.firstName?.charAt(0)}
                  {user?.profile?.lastName?.charAt(0)}
                </div>
                <div>
                  <h1 className='text-2xl font-bold'>Hello,</h1>
                  <p className='text-xl text-gray-600'>
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                </div>
              </div>
            </div>
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          {/* Nội dung bên phải */}
          <div className='w-4/5 ml-8'>{children}</div>
        </div>
      </div>
    </div>
  )
}
