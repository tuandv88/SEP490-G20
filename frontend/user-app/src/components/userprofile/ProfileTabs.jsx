import React from 'react';
import { User, UserCircle, Compass, FileText, BookOpen, Code, MessageCircle } from 'lucide-react';

export const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'algorithm', label: 'Algorithm', icon: Code },
    { id: 'discussionuserlist', label: 'Discussion', icon: MessageCircle },
    // { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'transaction', label: 'Transaction', icon: FileText },
  ];

  return (
    <div className="space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id
              ? 'bg-muted text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-primary'
          } w-full flex items-center px-3 py-2 text-sm font-medium rounded-md`}
        >
          <tab.icon className="h-5 w-5 mr-3" />
          {tab.label}
        </button>
      ))}
    </div>
  )
}