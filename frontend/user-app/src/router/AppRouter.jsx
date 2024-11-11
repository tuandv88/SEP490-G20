// src/router/AppRouter.jsx
import CourseDetail from '@/components/course/CourseDetail'
import { AUTHENTICATION_ROUTERS } from '../data/constants'
import { HomePage, About, NotFound, CourseList } from '../pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LearningSpace from '@/pages/LearningSpace'
import ErrorPage from '@/pages/ErrorPage'
// import Problems from '@/pages/Problems'
import Problem from '@/pages/Problem'
import { lazy, Suspense } from 'react'
import Loading from '@/lib/code-editor/components/Loading'
import ChatAI from '@/components/chat/ChatAI'
const Code = lazy(() => import('@/pages/Code'))

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: AUTHENTICATION_ROUTERS.HOME,
      element: <HomePage />
    },
    {
      path: AUTHENTICATION_ROUTERS.ABOUT,
      element: <LearningSpace />
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
      path: AUTHENTICATION_ROUTERS.CODE,
      element: (
        <Suspense fallback={<Loading />}>
          <Code />
        </Suspense>
      )
    },
    { path: AUTHENTICATION_ROUTERS.NOTFOUND, element: <NotFound /> },
    { path: AUTHENTICATION_ROUTERS.ERROR, element: <ErrorPage /> }
  ])
  return <RouterProvider router={router} />
}
