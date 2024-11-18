import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ChapterForm from './ChapterForm'

export default function EditChapterDialog({ isOpen, onClose, chapter, onSave }) {
  if (!isOpen || !chapter) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[95vw] max-w-[1000px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
        </DialogHeader>
        <ChapterForm
          chapter={chapter}
          onSave={(updatedChapter) => {
            onSave(updatedChapter)
            onClose()
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
