// src/routers/MainRouter.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage, About } from '../page' // Đường dẫn tới thư mục page
import { MENU } from '../defines/menu' // Đường dẫn tới menu

export const MainRouter = () => {
  const router = createBrowserRouter([
    {
      path: MENU.HOME,
      element: <HomePage />
    },
    {
      path: MENU.ABOUT,
      element: <About />
    }
  ])
  return <RouterProvider router={router} />
}
