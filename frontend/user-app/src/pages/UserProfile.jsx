import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AccountInfo } from '../components/userprofile/AccountInfo'
import { AlgorithmDashboard } from '../components/userprofile/algorithm/AlgorithmDashboard'
import { LearningDashboard } from '../components/userprofile/learning/LearningDashboard'
import { ProfileLayout } from '../components/userprofile/ProfileLayout'
import Layout from '@/layouts/layout'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'
import { Loading } from '@/components/ui/overlay'
import RoadmapDashboard from '@/components/userprofile/RoadmapDashboard'
import DiscussionUserList from '@/components/userprofile/discussion/DiscussionUserList'
import TransactionHistory from '@/components/transaction/TransactionHistory'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'

export function UserProfile() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { user } = useContext(UserContext)

  const validTabs = ['account', 'roadmap', 'learning', 'algorithm', 'discussionuserlist', 'transaction']
  
  const activeTab = tab && validTabs.includes(tab) ? tab : 'account'

  const handleTabChange = (newTab) => {
    navigate(AUTHENTICATION_ROUTERS.USERPROFILE + '/' + newTab)
  }

  useEffect(() => {
    const initializeUserProfile = async () => {
      try {
        if (!user) {
          await authServiceInstance.login()
        }
      } catch (error) {
        console.error('Error initializing user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeUserProfile()
  }, [user, navigate])

  if (loading) {
    return <Loading />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountInfo />
      case 'roadmap':
        return <RoadmapDashboard user={user} />
      case 'learning':
        return <LearningDashboard />
      case 'algorithm':
        return <AlgorithmDashboard />
      case 'discussionuserlist':
        return <DiscussionUserList />
      case 'transaction':
        return <TransactionHistory />
      default:
        return <AccountInfo />
    }
  }

  return (
    <Layout>
      <ProfileLayout activeTab={activeTab} setActiveTab={handleTabChange}>
        {renderTabContent()}
      </ProfileLayout>
    </Layout>
  )
}
