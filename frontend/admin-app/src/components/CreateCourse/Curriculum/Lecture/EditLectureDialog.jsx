import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LectureForm from './LectureForm'
import { useToast } from '@/hooks/use-toast'
import { updateLecture } from '@/services/api/lectureApi'

export default function EditLectureDialog({ isOpen, onClose, lecture, onSave }) {
  const { toast } = useToast()
  if (!isOpen || !lecture) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Lecture</DialogTitle>
        </DialogHeader>
        <LectureForm lecture={lecture} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
