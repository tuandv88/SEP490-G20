import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/loading'
import { motion } from 'framer-motion'

export default function LoadingTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeVariant, setActiveVariant] = useState('minimal')

  // Simulate loading
  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 seconds delay
  }

  const variants = ['minimal', 'default', 'dots', 'spinner', 'pulse']
  const sizes = ['sm', 'default', 'lg', 'xl']

  return (
    <div className='container p-4 mx-auto space-y-8'>
      <motion.h1
        className='mb-8 text-3xl font-bold text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Loading Spinner Test Page
      </motion.h1>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            {variants.map((variant) => (
              <Button
                key={variant}
                variant={activeVariant === variant ? 'default' : 'outline'}
                onClick={() => setActiveVariant(variant)}
              >
                {variant}
              </Button>
            ))}
          </div>
          <Button onClick={simulateLoading} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner variant={activeVariant} size='sm' showText={false} className='mr-2' />
                Testing...
              </>
            ) : (
              'Start Loading Test'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Loading State */}
      <Card>
        <CardHeader>
          <CardTitle>Current Loading State</CardTitle>
        </CardHeader>
        <CardContent className='min-h-[200px] flex items-center justify-center'>
          {isLoading ? (
            <LoadingSpinner variant={activeVariant} size='lg' />
          ) : (
            <p className='text-muted-foreground'>Click "Start Loading Test" to see the spinner</p>
          )}
        </CardContent>
      </Card>

      {/* Size Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {sizes.map((size) => (
              <div key={size} className='flex flex-col items-center gap-2'>
                <p className='text-sm font-medium'>{size}</p>
                <LoadingSpinner variant={activeVariant} size={size} showText={false} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real World Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Real World Examples</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Button Loading */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Button Loading</p>
            <Button disabled={isLoading} onClick={simulateLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner variant={activeVariant} size='sm' showText={false} className='mr-2' />
                  Processing...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>

          {/* Card Loading */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Card Loading</p>
            <Card>
              <CardContent className='h-[200px] relative'>
                {isLoading && (
                  <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
                    <LoadingSpinner variant={activeVariant} size='lg' />
                  </div>
                )}
                <div className='flex items-center justify-center h-full'>
                  <p className='text-muted-foreground'>Content Area</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
