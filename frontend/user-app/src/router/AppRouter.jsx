// src/router/AppRouter.jsx
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import { HomePage, About, NotFound, CourseList } from '../pages'
import Discuss from '@/pages/discussions/Discuss'
import DiscussionDetail from '@/pages/discussions/DiscussionDetail'
import CreateDiscussion from '@/pages/discussions/CreateDiscussion'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LearningSpace from '@/pages/LearningSpace'
import ErrorPage from '@/pages/ErrorPage'
// import Notification from '@/pages/notifications'
import NotificationHistory from "@/pages/notifications/NotificationHistory";
// import Problems from '@/pages/Problems'
import Problem from '@/pages/Problem'
import { lazy, Suspense } from 'react'
import Callback from '@/oidc/Callback'
import CourseDetail from '@/pages/CourseDetail';
import ProblemSpace from '@/components/problem/SolveChallenge/ProblemSpace';
import { UserProfile } from '@/pages/UserProfile';
import ProtectedRoute from './ProtectedRoute';
import Payment from '@/pages/Payment'
import SlientRenew from '@/oidc/silent-renew'
import LeaderBoard from '@/pages/LeaderBoard'
const Code = lazy(() => import('@/pages/Code'))

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: AUTHENTICATION_ROUTERS.HOME,
      element: <HomePage />
    },
    {
      path: AUTHENTICATION_ROUTERS.ABOUT,
      element: <About />
    },
    {
      path: AUTHENTICATION_ROUTERS.COURSELIST,
      element: <CourseList />
    },
    {
      path: AUTHENTICATION_ROUTERS.COURSEDETAIL,
      element: <CourseDetail />
    },
    {
      path: AUTHENTICATION_ROUTERS.LEARNINGSPACE,
      element: (
        <ProtectedRoute>
          <LearningSpace />
        </ProtectedRoute>
      )
    },
    {
      path: AUTHENTICATION_ROUTERS.PROBLEMS,
      element: <Problem />
    },
    {
      path: AUTHENTICATION_ROUTERS.CALLBACK,
      element: <Callback />
    },
    { path: AUTHENTICATION_ROUTERS.NOTFOUND, element: <NotFound /> },
    { path: AUTHENTICATION_ROUTERS.ERROR, element: <ErrorPage /> },
    {
      path: AUTHENTICATION_ROUTERS.DISCUSS,
      element: <Discuss />
    },
    {
      path: AUTHENTICATION_ROUTERS.DISCUSSIONDETAIL,
      element: <DiscussionDetail />
    },
    {
      path: AUTHENTICATION_ROUTERS.CREATEDISCUSSION,
      element: (
        <ProtectedRoute>
          <CreateDiscussion />
        </ProtectedRoute>
      )
    },
    {
      path: AUTHENTICATION_ROUTERS.USERPROFILE,
      element: (
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      )
    },
    {
      path: AUTHENTICATION_ROUTERS.PROBLEMSPACE,
      element: (
        <ProtectedRoute>
          <ProblemSpace />
        </ProtectedRoute>
      )
    },
    {
      path: AUTHENTICATION_ROUTERS.NOTIFICATION,
      element: (
        <ProtectedRoute>
          <NotificationHistory />
        </ProtectedRoute>
      )
    },
    {
      path: AUTHENTICATION_ROUTERS.PAYMENT,
      element: <Payment />
    },
    {
      path: AUTHENTICATION_ROUTERS.SILENTRENEW,
      element: <SlientRenew />
    },
    {
      path: AUTHENTICATION_ROUTERS.LEADERBOARD,
      element: <LeaderBoard />
    }
  ])
  return <RouterProvider router={router} />
}

