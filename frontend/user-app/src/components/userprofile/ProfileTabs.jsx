import React from 'react';
import { User, UserCircle, Compass, FileText, BookOpen, Code } from 'lucide-react';

export function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'algorithm', label: 'Algorithm', icon: Code },
    { id: 'transaction', label: 'Transaction', icon: FileText },
  ];

  return (
    <div className="space-y-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              group flex items-center w-full px-4 py-2 text-sm font-medium rounded-md
              ${
                activeTab === tab.id
                  ? 'bg-primaryButton text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <Icon className="mr-3 h-5 w-5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}