// src/router/AppRouter.jsx
import CourseDetail from '@/components/course/CourseDetail'
import { AUTHENTICATION_ROUTERS } from './../data/constants'
import { HomePage, About, NotFound, CourseList } from './../pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LearningSpace from '@/pages/LearningSpace'

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
    { path: AUTHENTICATION_ROUTERS.NOTFOUND, element: <NotFound /> }
  ])
  return <RouterProvider router={router} />
}
