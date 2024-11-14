import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil1Icon } from '@radix-ui/react-icons'
import ChapterForm from './ChapterItem'

export default function EditChapterDialog({ chapter, onSave }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
        </DialogHeader>
        <ChapterForm chapter={chapter} onSave={onSave} onCancel={() => {}} />
      </DialogContent>
    </Dialog>
  )
}
