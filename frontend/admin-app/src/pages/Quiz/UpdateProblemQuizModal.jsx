import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import UpdateProblemQuiz from '../Problem/ProblemQuiz/Update/UpdateProblemQuiz'

export function UpdateProblemQuizModal({ isOpen, onClose, quizId, question, problem, setIsUpdate, isUpdate }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-full w-full h-full m-0 p-0 overflow-auto'>
        <UpdateProblemQuiz
          quizId={quizId}
          onClose={onClose}
          question={question}
          problem={problem}
          setIsUpdate={setIsUpdate}
          isUpdate={isUpdate}
        ></UpdateProblemQuiz>
      </DialogContent>
    </Dialog>
  )
}
