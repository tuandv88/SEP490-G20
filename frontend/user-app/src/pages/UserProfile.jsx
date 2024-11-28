import React, { useState } from 'react'
import { AccountInfo } from '../components/userprofile/AccountInfo'
import { PersonalInfo } from '../components/userprofile/PersonalInfo'
import { AlgorithmDashboard } from '../components/userprofile/algorithm/AlgorithmDashboard'
import { LearningDashboard } from '../components/userprofile/learning/LearningDashboard'
import { MyPosts } from '../components/userprofile/MyPosts'
import { ProfileTabs } from '../components/userprofile/ProfileTabs'
import { ProfileLayout } from '../components/userprofile/ProfileLayout'
import { RoadmapDashboard } from '@/components/userprofile/RoadmapDashboard'
import Layout from '@/layouts/layout'

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('account')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountInfo />
      case 'personal':
        return <PersonalInfo />
      case 'roadmap':
        return <RoadmapDashboard />
      case 'learning':
        return <LearningDashboard />
      case 'algorithm':
        return <AlgorithmDashboard />
      case 'posts':
        return <MyPosts />
      default:
        return <AccountInfo />
    }
  }

  return (
    <Layout>
      <ProfileLayout>
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </ProfileLayout>
    </Layout>
  )
}
