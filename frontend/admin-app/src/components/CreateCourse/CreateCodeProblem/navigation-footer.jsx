import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export default function NavigationFooter({ currentStep, setCurrentStep, handleStepChange }) {
  return (
    <div className='flex items-center justify-between bg-muted'>
      <Button onClick={() => handleStepChange('previous')} disabled={currentStep === 'basic-info'}>
        <ArrowLeft className='w-4 h-4 mr-2' /> Previous
      </Button>
      <div className='flex space-x-4'>
        <Button
          variant={currentStep === 'basic-info' ? 'default' : 'outline'}
          onClick={() => setCurrentStep('basic-info')}
        >
          Basic Info
        </Button>
        <Button
          variant={currentStep === 'author-solution' ? 'default' : 'outline'}
          onClick={() => setCurrentStep('author-solution')}
        >
          Author Solution
        </Button>
      </div>
      <Button onClick={() => handleStepChange('next')} disabled={currentStep === 'author-solution'}>
        Next <ChevronRight className='w-4 h-4 ml-2' />
      </Button>
    </div>
  )
}
