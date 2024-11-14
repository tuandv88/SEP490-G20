import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from '@radix-ui/react-icons'
import LectureForm from './LectureItem'

export default function AddLectureDialog({ onSave }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline'>
          <PlusIcon className='mr-2' /> Add Lecture
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lecture</DialogTitle>
        </DialogHeader>
        <LectureForm onSave={onSave} onCancel={() => {}} />
      </DialogContent>
    </Dialog>
  )
}
