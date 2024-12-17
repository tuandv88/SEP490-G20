import React from 'react'
import { Button } from '@/components/ui/button'
import { Pencil1Icon, Cross2Icon } from '@radix-ui/react-icons'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'

export default function ChapterHeader({ chapter, onEdit, onDelete }) {
  const handleClick = (e) => {
    e.stopPropagation()
  }


  return (
    <div className='flex items-center justify-between' onClick={handleClick}>
      <span className='text-lg font-medium'>
        Chapter {chapter.order}: {chapter.title}
      </span>
      <div className='flex items-center space-x-2'>
        <Button variant='ghost' size='sm' onClick={onEdit}>
          <Pencil1Icon className='w-4 h-4' />
          <span className='sr-only'>Edit chapter</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='sm'>
              <Cross2Icon className='w-4 h-4' />
              <span className='sr-only'>Delete chapter</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this chapter?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the chapter and all its lectures.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
