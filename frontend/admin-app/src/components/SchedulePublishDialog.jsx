import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { addMinutes } from 'date-fns'

export default function SchedulePublishDialog({ open, onOpenChange, onConfirm }) {
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

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':')
    const newDate = new Date(selectedDate)
    newDate.setHours(parseInt(hours, 10))
    newDate.setMinutes(parseInt(minutes, 10))
    setSelectedDate(newDate)
  }

  const handleConfirm = () => {
    onConfirm(selectedDate)
  }

  const timeValue = selectedDate
    ? `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Schedule Course Publication</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                const newDate = new Date(date)
                newDate.setHours(selectedDate.getHours())
                newDate.setMinutes(selectedDate.getMinutes())
                setSelectedDate(newDate)
              }
            }}
            initialFocus
            disabled={(date) => date < new Date()}
          />
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='time' className='text-right'>
              Time
            </label>
            <input id='time' type='time' className='col-span-3' value={timeValue} onChange={handleTimeChange} />
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
