import React, { useState, useEffect } from 'react'
import { ArrowUpDown, MoreHorizontal, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
import { updateUserRole } from '@/services/api/userApi'
import { useToast } from '@/hooks/use-toast'
import { Link } from '@tanstack/react-router'
import { LockAccountDialog } from './LockAccountDialog'
import { USER_DETAIL_PATH } from '@/routers/router'

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
    cell: ({ row, roles }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [selectedRole, setSelectedRole] = useState(null)
      const queryClient = useQueryClient()
      const { toast } = useToast()
      const user = row.original
      const userRoles = user.roles // Giả sử roles là một mảng tên vai trò

      // Sử dụng useMutation để cập nhật vai trò người dùng
      const mutation = useMutation({
        mutationFn: (newRoleId) => updateUserRole(user.id, newRoleId),
        onMutate: async (newRoleId) => {
          await queryClient.cancelQueries(['users'])

          const previousUsers = queryClient.getQueryData(['users'])

          queryClient.setQueryData(['users'], (oldUsers) =>
            oldUsers.map((u) => (u.id === user.id ? { ...u, roles: [selectedRole.name] } : u))
          )

          setIsDialogOpen(false)
          toast({
            title: 'Success',
            description: 'Update role successfully.',
            duration: 1500
          })

          return { previousUsers }
        },
        onError: (error, newRoleId, context) => {
          queryClient.setQueryData(['users'], context.previousUsers)
          toast({
            title: 'Error',
            description: error.response?.data?.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại.',
            duration: 1500,
            variant: 'destructive'
          })
        },
        onSettled: () => {
          queryClient.invalidateQueries(['users'])
        }
      })

      const handleRoleChange = () => {
        if (selectedRole) {
          mutation.mutate(selectedRole.id)
        }
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
                value={userRoles[0]} // Giả sử mỗi người dùng chỉ có một vai trò
                onValueChange={(value) => {
                  const selected = roles.find((role) => role.name === value)
                  if (selected) {
                    setSelectedRole(selected)
                    setIsDialogOpen(true)
                  }
                }}
              >
                {roles.map((role) => (
                  <DropdownMenuRadioItem
                    key={role.id}
                    value={role.name}
                    disabled={userRoles.includes(role.name)} // Disable nếu là vai trò hiện tại
                  >
                    {role.name}
                    {userRoles.includes(role.name)} {/* Hiển thị nhãn "Hiện tại" */}
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
                <Button onClick={handleRoleChange} disabled={mutation.isLoading}>
                  {mutation.isLoading ? 'Updating...' : 'Confirm'}
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
                <Link to={USER_DETAIL_PATH} params={{ userId: user.id }}>
                  View user details
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem className='text-red-600' disabled={true}>
                Delete user
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
