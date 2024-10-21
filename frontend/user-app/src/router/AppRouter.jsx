// src/router/AppRouter.jsx
import { AUTHENTICATION_ROUTERS } from './../data/constants'
import { HomePage, About, NotFound, CourseList } from './../pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
    { path: AUTHENTICATION_ROUTERS.NOTFOUND, element: <NotFound /> }
  ])
  return <RouterProvider router={router} />
}
