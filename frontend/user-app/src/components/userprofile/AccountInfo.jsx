import React, { useContext } from 'react'
import { Mail, Phone, Calendar, User, SquareUser, CircleUserRound } from 'lucide-react'
import { UserContext } from '@/contexts/UserContext'

export function AccountInfo() {
  const { user } = useContext(UserContext)
  console.log(user)
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6">Account Information</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.profile?.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">{user?.profile?.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SquareUser className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-medium">{user?.profile?.firstName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CircleUserRound className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium">{user?.profile?.lastName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}