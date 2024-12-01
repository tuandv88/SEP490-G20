// src/router/AppRouter.jsx
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import { HomePage, About, NotFound, CourseList } from '../pages'
import Discuss from "@/pages/discussions/Discuss";
import DiscussionDetail from "@/pages/discussions/DiscussionDetail";
import CreateDiscussion from "@/pages/discussions/CreateDiscussion";
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
import { Notifications } from '@mui/icons-material';
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
      element: <LearningSpace />
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
      element: <CreateDiscussion />
    },
    {
      path: AUTHENTICATION_ROUTERS.USERPROFILE,
      element: <UserProfile />
    },
    {
      path: AUTHENTICATION_ROUTERS.PROBLEMSPACE,
      element: <ProblemSpace />
    },
    {
      path: AUTHENTICATION_ROUTERS.NOTIFICATION,
      element: <NotificationHistory />
    }
  ])
  return <RouterProvider router={router} />
}
