import React from 'react';
import { User, UserCircle, Compass, FileText, BookOpen, Code } from 'lucide-react';

export function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'algorithm', label: 'Algorithm', icon: Code },
    // { id: 'posts', label: 'Posts', icon: FileText },
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
                  ? 'border-primaryButton text-primaryButton'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`
                ${activeTab === tab.id ? 'text-primaryButton' : 'text-gray-400 group-hover:text-gray-500'}
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