import React, { useState, useEffect } from 'react'
import { ArrowUpDown, MoreHorizontal, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getAllRoles, updateUserRole } from '@/services/api/userApi'
import { useToast } from '@/hooks/use-toast'
import { Link } from '@tanstack/react-router'
import { LockAccountDialog } from './LockAccountDialog'

export const columns = [
  {
    accessorKey: 'index',
    header: () => <div className='font-bold text-primary text-center'>STT</div>,
    cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='font-bold text-primary w-full justify-start'
        >
          Username
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-left pl-4'>{row.getValue('userName')}</div>
  },
  {
    accessorKey: 'avatar',
    header: () => <div className='font-bold text-primary text-center'>Avatar</div>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className='flex justify-center'>
          <Avatar>
            <AvatarImage src={user.urlProfilePicture} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  {
    accessorKey: 'email',
    header: () => <div className='font-bold text-primary'>Email</div>,
    cell: ({ row }) => <div className='text-left'>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'fullName',
    header: () => <div className='font-bold text-primary'>Full Name</div>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className='text-left'>
          {user.firstName} {user.lastName}
        </div>
      )
    }
  },
  {
    accessorKey: 'roles',
    header: () => <div className='font-bold text-primary'>Roles</div>,
    cell: ({ row, onDataChange }) => {
      const [allRoles, setAllRoles] = useState([])
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState(null)
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [selectedRole, setSelectedRole] = useState(null)
      const userRoles = row.getValue('roles')
      const userId = row.original.id

      useEffect(() => {
        const fetchRoles = async () => {
          setLoading(true)
          setError(null)
          try {
            const roles = await getAllRoles()
            setAllRoles(roles)
          } catch (err) {
            setError(err.message)
            toast({
              title: 'Error',
              description: 'Failed to load roles. Please try again later.',
              variant: 'destructive'
            })
          } finally {
            setLoading(false)
          }
        }

        fetchRoles()
      }, [])
      const { toast } = useToast()
      const handleRoleChange = async () => {
        setLoading(true)
        try {
          await updateUserRole(userId, selectedRole.id)
          toast({
            title: 'Success',
            description: 'User role updated successfully.'
          })
          const updatedUser = { ...row.original, roles: [selectedRole.name] }
          onDataChange(updatedUser)
        } catch (err) {
          toast({
            title: 'Error',
            description: 'Failed to update user role. Please try again.',
            variant: 'destructive'
          })
        } finally {
          setLoading(false)
          setIsDialogOpen(false)
        }
      }

      if (loading) {
        return <div>Loading roles...</div>
      }

      if (error) {
        return <div>Error: {error}</div>
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 p-0'>
                <div className='flex flex-wrap gap-1'>
                  {userRoles.map((role, index) => (
                    <Badge key={index} variant='outline' className='capitalize'>
                      {role}
                    </Badge>
                  ))}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuRadioGroup
                value={userRoles[0]} // Assuming only one role per user
                onValueChange={(value) => {
                  const selectedRole = allRoles.find((role) => role.name === value)
                  if (selectedRole) {
                    setSelectedRole(selectedRole)
                    setIsDialogOpen(true)
                  }
                }}
              >
                {allRoles.map((role) => (
                  <DropdownMenuRadioItem key={role.id} value={role.name}>
                    {role.name}
                    {userRoles.includes(role.name) && <Check className='ml-auto h-4 w-4' />}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Role Change</DialogTitle>
                <DialogDescription>
                  Are you sure you want to change the user's role to {selectedRole?.name}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRoleChange} disabled={loading}>
                  {loading ? 'Updating...' : 'Confirm'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    }
  },
  {
    accessorKey: 'isAccountLocked',
    header: () => <div className='font-bold text-primary text-center'>Account Status</div>,
    cell: ({ row, changeData }) => {
      const [isLocked, setIsLocked] = useState(row.getValue('isAccountLocked'))
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const userId = row.original.id

      const handleStatusChange = (newStatus) => {
        if (newStatus === 'locked') {
          setIsDialogOpen(true)
        } else {
          // Handle unlocking logic here
        }
      }

      return (
        <div className='flex justify-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 p-0'>
                <Badge variant={isLocked ? 'destructive' : 'success'}>{isLocked ? 'Locked' : 'Active'}</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuRadioGroup value={isLocked ? 'locked' : 'active'} onValueChange={handleStatusChange}>
                <DropdownMenuRadioItem value='active'>
                  Active
                  {!isLocked && <Check className='ml-auto h-4 w-4' />}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='locked' disabled={isLocked}>
                  Locked
                  {isLocked && <Lock className='ml-auto h-4 w-4' />}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <LockAccountDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            userId={userId}
            onLockAccount={(lockoutTime) => {
              setIsLocked(true)
              setIsDialogOpen(false)
              changeData()
            }}
          />
        </div>
      )
    }
  },
  {
    id: 'actions',
    header: () => <div className='font-bold text-primary text-center'>Actions</div>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className='flex justify-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy User ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/user-detail/${user.id}`}>View user details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='text-red-600' disabled={true}>
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
