import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ErrorBoundary from './error-boundary'

// Component này sẽ throw error khi click
function BuggyCounter() {
  const [counter, setCounter] = useState(0)

  function handleClick() {
    setCounter((prevCounter) => {
      if (prevCounter > 4) {
        throw new Error('Counter crashed at value: ' + prevCounter)
      }
      return prevCounter + 1
    })
  }

  return (
    <div className='text-center'>
      <p className='mb-4 text-lg'>Counter Value: {counter}</p>
      <Button onClick={handleClick}>Increment Counter (Crashes at 5)</Button>
    </div>
  )
}

// Component để test các loại lỗi khác nhau
function ErrorTester() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Test error triggered by button click')
  }

  return (
    <div className='text-center'>
      <Button variant='destructive' onClick={() => setShouldError(true)}>
        Trigger Error
      </Button>
    </div>
  )
}

// Component để test render error
function RenderErrorTester() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    const invalidObject = null
    // This will cause a render error
    return <div>{invalidObject.nonExistentProperty}</div>
  }

  return (
    <div className='text-center'>
      <Button variant='destructive' onClick={() => setShouldError(true)}>
        Trigger Render Error
      </Button>
    </div>
  )
}

// Component chính để test
export default function ErrorTest() {
  return (
    <div className='container p-4 mx-auto space-y-4'>
      <h1 className='mb-8 text-2xl font-bold text-center'>Error Boundary Test Page</h1>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Test case 1: Counter Error */}
        <Card>
          <CardHeader>
            <CardTitle>Test 1: Counter Error</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <BuggyCounter />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Test case 2: Immediate Error */}
        <Card>
          <CardHeader>
            <CardTitle>Test 2: Immediate Error</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <ErrorTester />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Test case 3: Render Error */}
        <Card>
          <CardHeader>
            <CardTitle>Test 3: Render Error</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <RenderErrorTester />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Test case 4: Async Error */}
        <Card>
          <CardHeader>
            <CardTitle>Test 4: Async Error</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <Button
                onClick={() => {
                  setTimeout(() => {
                    throw new Error('Async error after 1 second')
                  }, 1000)
                }}
              >
                Trigger Async Error
              </Button>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
