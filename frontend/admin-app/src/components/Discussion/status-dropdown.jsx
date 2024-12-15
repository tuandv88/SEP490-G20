import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { updateDiscussionStatus } from '@/services/api/discussionApi'
import { useToast } from '@/hooks/use-toast'

export function StatusDropdown({ isActive, discussionId, onStatusChange }) {
  const { toast } = useToast()

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDiscussionStatus(discussionId)
      toast({
        title: 'Status updated',
        description: `Discussion status changed to ${newStatus ? 'active' : 'inactive'}.`,
        variant: 'default'
      })
      onStatusChange()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update discussion status. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge variant={isActive ? 'success' : 'destructive'} className='cursor-pointer'>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleStatusChange(true)} disabled={isActive}>
          Set Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange(false)} disabled={!isActive}>
          Set Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

StatusDropdown.propTypes = {
  isActive: PropTypes.bool.isRequired,
  discussionId: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired
}
