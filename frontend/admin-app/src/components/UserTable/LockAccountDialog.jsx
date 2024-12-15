import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { lockAccountUser } from '@/services/api/userApi'
import { useToast } from '@/hooks/use-toast'

export function LockAccountDialog({ isOpen, onClose, userId, onLockAccount }) {
  const [lockoutTime, setLockoutTime] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const minDateTime = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 16)

  const validateLockoutTime = (time) => {
    try {
      if (!time) return false

      const selectedTime = new Date(time).getTime()
      const currentTime = Date.now()
      const minTime = currentTime + 10 * 60 * 1000 // Thời gian hiện tại + 10 phút

      // Kiểm tra thời gian chọn phải lớn hơn thời gian hiện tại + 10 phút
      if (selectedTime <= currentTime) {
        toast({
          title: 'Error',
          description: 'Lockout time cannot be in the past.',
          variant: 'destructive',
          duration: 3000
        })
        return false
      }

      if (selectedTime < minTime) {
        toast({
          title: 'Error',
          description: 'Lockout time must be at least 10 minutes from now.',
          variant: 'destructive',
          duration: 3000
        })
        return false
      }

      return true
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid date format.',
        variant: 'destructive',
        duration: 3000
      })
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateLockoutTime(lockoutTime)) {
      return
    }

    setLoading(true)
    try {
      const lockoutTimeUtc = new Date(lockoutTime).toISOString()
      await lockAccountUser(userId, lockoutTimeUtc)

      toast({
        title: 'Success',
        description: 'Account locked successfully.',
        variant: 'success',
        duration: 1500
      })
      onLockAccount()
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to lock account. Please try again.',
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lock Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='lockoutTime' className='text-right'>
                Lockout Time
              </label>
              <Input
                id='lockoutTime'
                type='datetime-local'
                min={minDateTime}
                value={lockoutTime}
                onChange={(e) => setLockoutTime(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value) {
                    validateLockoutTime(e.target.value)
                  }
                }}
                className='col-span-3'
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Locking...' : 'Lock Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
