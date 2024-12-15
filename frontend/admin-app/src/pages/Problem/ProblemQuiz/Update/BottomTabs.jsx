import React from 'react'
import { FileText, Code, BookOpen, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ControlledAlertDialog } from '@/components/alert/ControlledAlertDialog'
import { useFormContext } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: FileText },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'description', label: 'Template', icon: BookOpen }
]

export default function BottomTabs({ activeTab, setActiveTab, isSaveTemplate, isRunSuccess, form2, isLoadingSubmit }) {
  const {
    trigger,
    formState: { errors }
  } = useFormContext()
  const { toast } = useToast()
  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const isLastTab = currentTabIndex === tabs.length - 1
  const isFirstTab = currentTabIndex === 0

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)
  const handleConfirm = () => {
    closeDialog()
  }

  const handlePrevious = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id)
    }
  }

  const handleNext = async () => {
    if (!isLastTab) {
      if (activeTab === 'basic') {
        try {
          // Log giá trị content trước khi validate

          // Validate form2 trước
          const isQuestionValid = await form2.trigger(['content', 'questionLevel', 'mark'], { shouldFocus: true })

          // Log kết quả validate của form2

          // Validate form chính
          const isValid = await trigger(
            [
              'title',
              'language',
              'difficultyType',
              'cpuTimeLimit',
              'cpuExtraTime',
              'memoryLimit',
              'stackLimit',
              'maxThread',
              'maxFileSize'
            ],
            { shouldFocus: true }
          )

          // Log để debug
          

          if (!isValid || !isQuestionValid) {
            let errorMessage = 'Please check the following fields:\n'

            // Kiểm tra lỗi từ form chính
            if (Object.keys(errors).length > 0) {
              Object.keys(errors).forEach((key) => {
                errorMessage += `\n- ${key}: ${errors[key].message}`
              })
            }

            // Kiểm tra lỗi từ form2
            if (Object.keys(form2.formState.errors).length > 0) {
              Object.keys(form2.formState.errors).forEach((key) => {
                errorMessage += `\n- ${key}: ${form2.formState.errors[key].message}`
              })
            }

            toast({
              variant: 'destructive',
              title: 'Validation Error',
              description: errorMessage
            })
            return
          }

          // Nếu không có lỗi, chuyển sang tab tiếp theo
          setActiveTab(tabs[currentTabIndex + 1].id)
        } catch (error) {
          console.error('Validation error:', error)
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'An error occurred during validation'
          })
        }
      } else if (activeTab === 'code' && !isRunSuccess) {
        openDialog()
        return
      } else {
        setActiveTab(tabs[currentTabIndex + 1].id)
      }
    }
  }

  return (
    <div className='sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Button
            type='button'
            variant='ghost'
            onClick={handlePrevious}
            disabled={isFirstTab}
            className='flex items-center'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Previous
          </Button>

          <div className='flex justify-center space-x-4'>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  type='button'
                  key={tab.id}
                  className={`
          flex flex-row items-center justify-center px-4 relative
          ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}
        `}
                >
                  <Icon className='h-5 w-5 mr-2' />
                  <span className='text-xs'>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {isLastTab && (
            <>
              {isLoadingSubmit ? (
                <>
                  <Button type='button' disabled={isLoadingSubmit}>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Submitting...
                  </Button>
                </>
              ) : (
                <Button
                  disabled={isSaveTemplate === false}
                  type='submit'
                  variant='default'
                  className='flex items-center'
                >
                  Submit
                </Button>
              )}
            </>
          )}

          {!isLastTab && (
            <Button
              type='button'
              variant='ghost'
              onClick={isRunSuccess === false && activeTab === 'code' ? openDialog : handleNext}
              className='flex items-center'
            >
              Next
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          )}
        </div>
      </div>
      <ControlledAlertDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleConfirm}
        title='Check the code again!'
        description='You need to run the code and test case successfully before coming to the next step.'
      />
    </div>
  )
}
