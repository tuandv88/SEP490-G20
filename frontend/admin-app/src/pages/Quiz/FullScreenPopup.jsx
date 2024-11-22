import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import TestPanel from "../CourseTest/TestPanel"
import CreateProblem from "../Problem/Create/CreateProblem"

export function FullScreenPopup({ isOpen, onClose, quizDetail }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-full m-0 p-0 overflow-auto">

        <CreateProblem></CreateProblem>
      </DialogContent>
    </Dialog>
  )
}

