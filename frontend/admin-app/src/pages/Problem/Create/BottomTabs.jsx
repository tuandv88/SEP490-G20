import { FileText, Code, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: FileText },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'description', label: 'Template', icon: BookOpen }
]

export default function BottomTabs({ activeTab, setActiveTab, isSaveTemplate, isRunSuccess }) {
  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const isLastTab = currentTabIndex === tabs.length - 1
  const isFirstTab = currentTabIndex === 0
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handlePrevious = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id)
    }
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200'>
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
                  onClick={() => {isRunSuccess === false && activeTab === 'code' ? setIsAlertOpen(true) : setActiveTab(tab.id)}  }
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

          {isLastTab && 
            <Button disabled={isSaveTemplate === false} type='submit' variant='default' className='flex items-center'>
              Submit
            </Button>
          }

          {!isLastTab && (
            <Button disabled={isRunSuccess === false && activeTab === 'code'} type='button' variant='ghost' onClick={handleNext} className='flex items-center'>
            Next
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
          )}
        </div>
      </div>     
    </div>
  )
}
