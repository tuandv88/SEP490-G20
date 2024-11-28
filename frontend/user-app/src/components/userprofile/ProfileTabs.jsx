import React from 'react';
import { User, UserCircle, Compass, FileText, BookOpen, Code } from 'lucide-react';

export function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'account', label: 'Thông tin tài khoản', icon: User },
    { id: 'personal', label: 'Thông tin cá nhân', icon: UserCircle },
    { id: 'roadmap', label: 'Gợi ý lộ trình', icon: Compass },
    { id: 'learning', label: 'Khóa học của tôi', icon: BookOpen },
    { id: 'algorithm', label: 'Giải thuật', icon: Code },
    { id: 'posts', label: 'Bài viết của tôi', icon: FileText },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`
                ${activeTab === tab.id ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'}
                -ml-0.5 mr-2 h-5 w-5
              `} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}