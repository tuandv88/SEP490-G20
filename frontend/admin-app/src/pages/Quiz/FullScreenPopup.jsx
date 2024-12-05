import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import CreateProblemQuiz from '../Problem/ProblemQuiz/Create/CreateProblemQuiz'

export function FullScreenPopup({ isOpen, onClose, quizId, isUpdate, setIsUpdate }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-full w-full h-full m-0 p-0 overflow-auto'>
        <CreateProblemQuiz quizId={quizId} onClose={onClose} isUpdate={isUpdate} setIsUpdate={setIsUpdate}></CreateProblemQuiz>
      </DialogContent>
    </Dialog>
  )
}
