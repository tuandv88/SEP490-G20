import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from '@radix-ui/react-icons'
import ChapterForm from './ChapterItem'

export default function AddChapterDialog({ onSave }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='mr-2' /> Add Chapter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
        </DialogHeader>
        <ChapterForm onSave={onSave} onCancel={() => {}} />
      </DialogContent>
    </Dialog>
  )
}
