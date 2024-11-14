import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil1Icon } from '@radix-ui/react-icons'
import LectureForm from './LectureItem'

export default function EditLectureDialog({ lecture, onSave }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Lecture</DialogTitle>
        </DialogHeader>
        <LectureForm lecture={lecture} onSave={onSave} onCancel={() => {}} />
      </DialogContent>
    </Dialog>
  )
}
