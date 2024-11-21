import './styles/index.css'
import { Suspense } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { mainRouter, loginRouter } from '@/routers/router'
import ErrorBoundary from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/loading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a QueryClient instance
const queryClient = new QueryClient()

function App() {

  // Determine which router to use based on the current path
  const currentPath = window.location.pathname
  const router = currentPath.startsWith('/login') ? loginRouter : mainRouter
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingSpinner variant='minimal' />}>
            <RouterProvider router={router} />
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App