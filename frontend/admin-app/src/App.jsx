import './styles/index.css'
import { Suspense } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { mainRouter, loginRouter } from '@/routers/router'
import ErrorBoundary from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/loading'
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  // Determine which router to use based on the current path
  const currentPath = window.location.pathname
  const router = currentPath.startsWith('/login') ? loginRouter : mainRouter
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner variant='minimal' />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
