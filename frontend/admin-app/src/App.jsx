import './styles/index.css'
import { Suspense } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/routers/router'
import ErrorBoundary from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/loading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingSpinner variant='minimal' />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
