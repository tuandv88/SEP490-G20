import React, { useContext, useEffect, useState } from 'react'
import { AccountInfo } from '../components/userprofile/AccountInfo'
import { AlgorithmDashboard } from '../components/userprofile/algorithm/AlgorithmDashboard'
import { LearningDashboard } from '../components/userprofile/learning/LearningDashboard'
import { MyPosts } from '../components/userprofile/MyPosts'
import { ProfileTabs } from '../components/userprofile/ProfileTabs'
import { ProfileLayout } from '../components/userprofile/ProfileLayout'
import Layout from '@/layouts/layout'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'
import { Loading } from '@/components/ui/overlay'
import RoadmapDashboard from '@/components/userprofile/RoadmapDashboard'
import { ProblemAPI } from '@/services/api/problemApi'
import TransactionHistory from '@/components/transaction/TransactionHistory'

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('account')
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [problemSolved, setProblemSolved] = useState([])
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  
  useEffect(() => {
    const initializeUserProfile = async () => {
      try {
        if (!user) {
          await authServiceInstance.login()
        }
        const response = await ProblemAPI.getProblemSolved()
        setProblemSolved(response.solved)
      } catch (error) {
        console.error('Error initializing user profile:', error)
      } finally {
        setLoading(false)
      }
    }
  
    initializeUserProfile()
  }, [user, navigate])

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const solvedProblems = await ProblemAPI.getSolvedProblems();
        setProblems(solvedProblems);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    
    fetchSolvedProblems();
  }, []);


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
        return <AlgorithmDashboard problemSolved={problemSolved} problems={problems} />
      case 'transaction':
        return <TransactionHistory />
      default:
        return <AccountInfo />
    }
  }

  return (
    <Layout>
       <ProfileLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderTabContent()}
      </ProfileLayout>
    </Layout>
  )
}
