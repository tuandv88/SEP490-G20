import { X } from 'lucide-react'
import UpdateProblemQuiz from '../Problem/ProblemQuiz/Update/UpdateProblemQuiz'

export function UpdateProblemQuizModal({ isOpen, onClose, quizId, question, problem, setIsUpdate, isUpdate }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[10] bg-black bg-opacity-50 transition-opacity'>
      <div className='fixed inset-0 z-[10]'>
        <div className='w-full h-full bg-white relative'>
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors z-[9999]'
          >
            <X size={24} />
          </button>
          <div className='w-full h-full overflow-auto'>
            <UpdateProblemQuiz
              quizId={quizId}
              onClose={onClose}
              question={question}
              problem={problem}
              setIsUpdate={setIsUpdate}
              isUpdate={isUpdate}
            ></UpdateProblemQuiz>
          </div>
        </div>
      </div>
    </div>
  )
}
