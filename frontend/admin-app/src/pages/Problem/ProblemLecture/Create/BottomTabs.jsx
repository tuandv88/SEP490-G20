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

export default function BottomTabs({ activeTab, setActiveTab, isSaveTemplate, isRunSuccess, isLoadingSubmit }) {
  const { trigger, formState: { errors } } = useFormContext()
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
        // Validate basic info form
        const isValid = await trigger([
          'title',
          'description',
          'language',
          'difficultyType',
          'cpuTimeLimit',
          'cpuExtraTime',
          'memoryLimit',
          'stackLimit',
          'maxThread',
          'maxFileSize'
        ])

        if (!isValid) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill in all required fields correctly"
          })
          return
        }
      }

      if (activeTab === 'code' && !isRunSuccess) {
        openDialog()
        return
      }

      setActiveTab(tabs[currentTabIndex + 1].id)
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
            <Button type='button' variant='ghost' onClick={isRunSuccess === false && activeTab === 'code' ? openDialog : handleNext} className='flex items-center'>
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
        title="Check the code again!"
        description="You need to run the code and test case successfully before coming to the next step."
      />  
    </div>
  )
}

// 