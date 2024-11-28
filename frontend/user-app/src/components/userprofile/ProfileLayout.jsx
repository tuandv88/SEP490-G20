import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { UserContext } from '@/contexts/UserContext';
import authServiceInstance from '@/oidc/AuthService';


export function ProfileLayout({ children }) {
  const { user } = useContext(UserContext)

  return (
    <div className="min-h-screen bg-gray-50 mt-[75px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.profile?.firstName?.charAt(0)}
              {user?.profile?.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hello,</h1>
              <p className="text-xl text-gray-600">{user?.profile?.firstName} {user?.profile?.lastName}</p>
            </div>
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => authServiceInstance.logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}