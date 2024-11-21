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
  return (
    <div className='flex items-center justify-between'>
      <h4 className='text-lg font-semibold'>{chapter.title}</h4>
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' size='sm' onClick={onEdit}>
          <Pencil1Icon />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='sm'>
              <Cross2Icon />
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
        <span>
          {chapter.timeEstimation} hour{chapter.timeEstimation !== 1 ? 's' : ''}
        </span>
        <span
          className={`px-2 py-1 rounded ${
            chapter.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {chapter.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}
