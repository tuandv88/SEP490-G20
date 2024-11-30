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

  const minDateTime = new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)

  const validateLockoutTime = (time) => {
    if (!time) return true // Không kiểm tra nếu không có giá trị
    const selectedTime = new Date(time).getTime()
    const minTime = new Date(minDateTime).getTime()
    return selectedTime >= minTime
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (lockoutTime && !validateLockoutTime(lockoutTime)) {
      toast({
        title: 'Error',
        description: 'Lockout time must be at least 30 minutes from now.',
        variant: 'destructive',
        duration: 3000
      })
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
      onLockAccount(lockoutTimeUtc)
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to lock account. Please try again.',
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
                  if (e.target.value && !validateLockoutTime(e.target.value)) {
                    toast({
                      title: 'Warning',
                      description: 'Lockout time must be at least 30 minutes from now.',
                      variant: 'warning',
                      duration: 3000
                    })
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
