/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useContext } from 'react'
import { UserContext } from '@/contexts/UserContext'


const ChatDefaultScreen = () => {
  const { user } = useContext(UserContext)

  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] p-4'>
      <h1 className='text-2xl font-medium mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent'>Hello, {user?.profile?.firstName} {user?.profile?.lastName}!</h1>
      <h2 className='text-xl mb-8'>
        How can I assist you today? Whether you're looking for information, ideas, or just some friendly conversation,
        I'm here for you?
      </h2>
    </div>
  )
}

export default ChatDefaultScreen
