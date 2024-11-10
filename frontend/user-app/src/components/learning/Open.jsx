import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Quiz from './Quiz'


export default function QuizPopup() {
  const [isOpen, setIsOpen] = useState(false)

  const openQuiz = () => setIsOpen(true)
  const closeQuiz = () => setIsOpen(false)

  return (
    <div>
      <Button onClick={openQuiz}>Open Quiz</Button>

      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white w-full h-full max-w-4xl max-h-[90vh] rounded-lg shadow-lg overflow-auto relative'>
            <Button variant='ghost' size='icon' className='absolute top-4 right-4' onClick={closeQuiz}>
              <X className='h-4 w-4' />
            </Button>
            <div className='p-6'>
              <Quiz />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
