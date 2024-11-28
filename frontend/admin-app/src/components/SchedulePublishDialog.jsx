import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { addMinutes, format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

export default function SchedulePublishDialog({ open, onOpenChange, onConfirm }) {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date()
    return addMinutes(date, 15)
  })

  useEffect(() => {
    if (open) {
      const date = new Date()
      setSelectedDate(addMinutes(date, 15))
    }
  }, [open])

  const handleDateSelect = (date) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(selectedDate.getHours())
      newDate.setMinutes(selectedDate.getMinutes())
      setSelectedDate(newDate)
    }
  }

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':')
    const newDate = new Date(selectedDate)
    newDate.setHours(parseInt(hours, 10))
    newDate.setMinutes(parseInt(minutes, 10))
    setSelectedDate(newDate)
  }

  const showErrorToast = (message) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
      duration: 3000
    })
  }

  const handleConfirm = () => {
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      const currentDateTime = new Date()
      const minimumDateTime = addMinutes(currentDateTime, 15)

      if (selectedDate < minimumDateTime) {
        showErrorToast('Please select a date and time at least 15 minutes in the future.')
        return
      }

      const utc7Date = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000)
      onConfirm(utc7Date.toISOString())
      console.log('Confirmed UTC+7 date and time:', utc7Date.toISOString())
      onOpenChange(false)
    } else {
      showErrorToast('Invalid date selected. Please try again.')
    }
  }

  const timeValue =
    selectedDate instanceof Date && !isNaN(selectedDate)
      ? `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`
      : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Schedule Course Publication</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Calendar mode='single' selected={selectedDate} onSelect={handleDateSelect} initialFocus />
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='time' className='text-right'>
              Time
            </label>
            <input
              id='time'
              type='time'
              className='col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              value={timeValue}
              onChange={handleTimeChange}
            />
          </div>
          <div className='text-sm text-muted-foreground'>
            Selected:{' '}
            {selectedDate instanceof Date && !isNaN(selectedDate) ? format(selectedDate, 'PPpp') : 'Invalid date'}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
