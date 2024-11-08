import './styles/index.css'
import { Suspense } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { router } from '@/routers/router'
import ErrorBoundary from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/loading'
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Suspense fallback={<LoadingSpinner variant='minimal' />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
