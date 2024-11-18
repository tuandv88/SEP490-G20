import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LectureForm from './LectureForm'

export default function AddLectureDialog({ isOpen, onClose, onSave }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Lecture</DialogTitle>
        </DialogHeader>
        <LectureForm onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
