import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LectureForm from './LectureForm'

export default function EditLectureDialog({ isOpen, onClose, lecture, onSave }) {
  if (!isOpen || !lecture) return null

  const handleSave = (updatedLecture) => {
    onSave(updatedLecture)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Lecture</DialogTitle>
        </DialogHeader>
        <LectureForm lecture={lecture} onSave={handleSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
