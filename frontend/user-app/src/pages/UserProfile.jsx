import React, { useContext, useEffect, useState } from 'react'
import { AccountInfo } from '../components/userprofile/AccountInfo'
import { AlgorithmDashboard } from '../components/userprofile/algorithm/AlgorithmDashboard'
import { LearningDashboard } from '../components/userprofile/learning/LearningDashboard'
import { MyPosts } from '../components/userprofile/MyPosts'
import { ProfileTabs } from '../components/userprofile/ProfileTabs'
import { ProfileLayout } from '../components/userprofile/ProfileLayout'
import { RoadmapDashboard } from '@/components/userprofile/RoadmapDashboard'
import Layout from '@/layouts/layout'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'
import { Loading } from '@/components/ui/overlay'

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('account')
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        await authServiceInstance.login()
      }
      setLoading(false) 
    }

    checkUser()
  }, [user, navigate])

  if (loading) {
    return <Loading />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountInfo />
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
