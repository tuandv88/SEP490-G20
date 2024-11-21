import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Form } from '@/components/ui/form'
import BasicInfoStep from '@/components/CreateCourse/CreateCodeProblem/basic-info-step'
import AuthorSolutionStep from '@/components/CreateCourse/CreateCodeProblem/author-solution-step'
import NavigationFooter from '@/components/CreateCourse/CreateCodeProblem/navigation-footer'

export default function CreateProblem() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState('basic-info')
  const [variables, setVariables] = useState([{ name: '', value: '' }])
  const [solutionCode, setSolutionCode] = useState('')
  const [testCode, setTestCode] = useState('')
  const [testResult, setTestResult] = useState('')

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      language: 'java'
    }
  })

  alert('CreateProblem')

  const handleStepChange = (direction) => {
    if (direction === 'next' && currentStep === 'basic-info') {
      form.trigger(['title', 'description'])
      const { title, description } = form.getValues()
      if (!title.trim() || !description.trim()) {
        return
      }
      setCurrentStep('author-solution')
    } else if (direction === 'previous' && currentStep === 'author-solution') {
      setCurrentStep('basic-info')
    }
  }

  const runCode = () => {
    // Implement code execution logic here
    setTestResult('Code execution result will be displayed here.')
  }

  const onSubmit = (data) => {
    if (!solutionCode.trim() || !testCode.trim()) {
      return
    }
    // Implement problem submission logic here
    console.log('Problem submitted', {
      ...data,
      variables,
      solutionCode,
      testCode
    })
    // Navigate back to curriculum or show success message
    navigate({ to: '/curriculum' })
  }

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground'>


       <div className='p-1'>
        <Link to='/curriculum'>
          <Button variant='ghost'>
            <ArrowLeft className='w-2 h-2 mr-1' /> Back to Curriculum
          </Button>
        </Link>
      </div>

      <div className='flex-grow w-full p-1 overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {currentStep === 'basic-info' && (
              <><BasicInfoStep form={form} variables={variables} setVariables={setVariables} /></>
            )}
            {currentStep === 'author-solution' && (
              <AuthorSolutionStep
                form={form}
                solutionCode={solutionCode}
                setSolutionCode={setSolutionCode}
                testCode={testCode}
                setTestCode={setTestCode}
                testResult={testResult}
                runCode={runCode}
                onSubmit={onSubmit}
              />
            )}
          </form>
        </Form>
      </div>

      <NavigationFooter currentStep={currentStep} setCurrentStep={setCurrentStep} handleStepChange={handleStepChange} />
    </div>
  )
}
