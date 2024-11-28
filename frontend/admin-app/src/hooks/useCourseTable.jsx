import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  MoreHorizontal,
  ArrowUpDown,
  Check,
  GraduationCap,
  Edit,
  Send,
  Clock,
  Archive,
  Copy,
  Eye,
  Trash
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import { format, addMinutes, parseISO } from 'date-fns'
import { formatDateTime } from '@/utils/format'
import { convertLocalToUTC } from '@/utils/format'
import {
  getCourses,
  changeCourseLevel,
  getCourseDetails,
  changeCourseStatus,
  deleteCourse
} from '@/services/api/courseApi'

const statusOptions = [
  {
    label: 'Draft',
    value: 'Draft',
    icon: Edit,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  },
  {
    label: 'Published',
    value: 'Published',
    icon: Send,
    color: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300'
  },
  {
    label: 'Scheduled',
    value: 'Scheduled',
    icon: Clock,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-300'
  },
  {
    label: 'Archived',
    value: 'Archived',
    icon: Archive,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300'
  }
]

const levelOptions = [
  { label: 'Basic', value: 'Basic', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  {
    label: 'Intermediate',
    value: 'Intermediate',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  },
  {
    label: 'Advanced',
    value: 'Advanced',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
  },
  { label: 'Expert', value: 'Expert', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' }
]

export default function useCourseTable() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  const fetchCourses = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getCourses(pageIndex, pageSize)
      console.log(response)
      const { courseDtos } = response
      setCourses(courseDtos.data || [])
      setTotalCount(courseDtos.count || 0)
      setPageIndex(courseDtos.pageIndex)
      setPageSize(courseDtos.pageSize)
      setError(null)
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError(error)
      setCourses([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const checkCourseRequirements = async (courseId) => {
    try {
      const courseDetails = await getCourseDetails(courseId)
      const { chapterDetailsDtos } = courseDetails.courseDetailsDto

      if (chapterDetailsDtos.length < 3 || chapterDetailsDtos.some((chapter) => chapter.lectureDtos.length < 2)) {
        toast({
          title: 'Cannot change status',
          description: 'The course must have at least 3 chapters, and each chapter must have at least 3 lectures.',
          variant: 'destructive',
          duration: 1500
        })
        return false
      }
      return true
    } catch (error) {
      console.error('Error checking course details:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while checking course details.',
        variant: 'destructive',
        duration: 1500
      })
      return false
    }
  }
  const handleDeleteCourse = async (courseId) => {
    await deleteCourse(courseId)
    await fetchCourses()
  }

  const handleStatusChange = async (courseId, newStatus, currentStatus) => {
    console.log(`Changing status for course ${courseId} from ${currentStatus} to ${newStatus}`)

    if (newStatus === currentStatus) {
      console.log('New status is the same as current status. No action needed.')
      return
    }

    setSelectedCourse(courseId)
    setNewStatus(newStatus)

    if (newStatus === 'Published' || newStatus === 'Scheduled') {
      const meetsRequirements = await checkCourseRequirements(courseId)
      if (!meetsRequirements) {
        return
      }
    }

    if (newStatus === 'Scheduled') {
      setIsStatusChangeDialogOpen(true)
      return
    }

    const scheduledDate = currentStatus === 'Scheduled' ? null : undefined
    console.log(`Setting scheduledDate to: ${scheduledDate}`)

    await updateCourseStatus(courseId, newStatus, scheduledDate)
  }

  const updateCourseStatus = async (courseId, status, scheduledPublishDate) => {
    console.log(
      `Updating course ${courseId} status to ${status} with scheduledPublishDate: ${convertLocalToUTC(scheduledPublishDate)}`
    )

    try {
      const payload = {
        courseStatus: status,
        scheduledPublishDate: convertLocalToUTC(scheduledPublishDate)
      }

      console.log('Payload for API call:', payload)

      const response = await changeCourseStatus(courseId, payload)
      console.log('API response:', response)

      await fetchCourses()
      toast({
        title: 'Status updated',
        description: `Course status has been changed to ${status}.`
      })
    } catch (error) {
      console.error('Error updating course status:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while updating the course status.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const handleScheduledStatusConfirm = async (scheduledDateTime) => {
    const scheduledDate = new Date(scheduledDateTime)

    try {
      console.log('Updating course status to Scheduled with scheduled date:', scheduledDateTime)
      await updateCourseStatus(selectedCourse, 'Scheduled', scheduledDateTime)
      setIsStatusChangeDialogOpen(false)
      toast({
        title: 'Course Scheduled',
        description: `Course has been scheduled for publication on ${format(scheduledDate, 'PPpp')}.`
      })
    } catch (error) {
      console.error('Error scheduling course:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while scheduling the course.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const handleLevelChange = async (courseId, newLevel, currentLevel) => {
    const payload = {
      courseLevel: newLevel
    }
    if (newLevel === currentLevel) {
      console.log('New level is the same as current level. No action needed.')
      return
    }

    try {
      await changeCourseLevel(courseId, payload)
      await fetchCourses()
      toast({
        title: 'Level updated',
        description: `Course level has been changed to ${newLevel}.`
      })
    } catch (error) {
      console.error('Error changing course level:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while updating the course level.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='px-1'>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='px-1'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='px-0 font-semibold hover:bg-transparent'
        >
          Title
          <ArrowUpDown className='w-4 h-4 ml-1' />
        </Button>
      ),
      cell: ({ row }) => <div className='pl-4'>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'timeEstimation',
      header: ({ column }) => (
        <div className='text-right'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='px-0 font-semibold hover:bg-transparent'
          >
            Time Estimate
            <ArrowUpDown className='w-4 h-4 ml-1' />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className='text-right pr-4'>{row.getValue('timeEstimation')} hours</div>
    },
    {
      accessorKey: 'scheduledPublishDate',
      header: ({ column }) => (
        <div className='text-center'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='px-0 font-semibold hover:bg-transparent'
          >
            Scheduled Publish Date
            <ArrowUpDown className='w-4 h-4 ml-1' />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue('scheduledPublishDate')
        return <div className='text-center'>{formatDateTime(date)}</div>
      }
    },
    {
      accessorKey: 'courseStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('courseStatus')
        const statusOption = statusOptions.find((option) => option.value === status)
        const StatusIcon = statusOption?.icon

        return (
          <div className='flex justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className={`h-8 px-3 flex items-center space-x-2 rounded-full ${statusOption?.color}`}
                >
                  {StatusIcon && <StatusIcon className='w-4 h-4' />}
                  <span>{status}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' className='w-56'>
                <DropdownMenuLabel className='text-center'>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={status}
                  onValueChange={(newStatus) => handleStatusChange(row.original.id, newStatus, status)}
                >
                  {statusOptions.map((option) => {
                    const OptionIcon = option.icon
                    return (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                        className={`flex items-center space-x-2 ${option.color} rounded-md transition-colors`}
                        disabled={option.value === status}
                      >
                        <OptionIcon className='w-4 h-4' />
                        <span>{option.label}</span>
                        {option.value === status && <Check className='w-4 h-4 ml-auto' />}
                      </DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      filterFn: (row, id, filterValues) => {
        if (!filterValues || filterValues.length === 0) return true
        const value = row.getValue(id)
        return filterValues.includes(value)
      }
    },
    {
      accessorKey: 'courseLevel',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-center font-semibold hover:bg-transparent'
        >
          Level
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      ),
      cell: ({ row }) => {
        const level = row.getValue('courseLevel')
        const levelOption = levelOptions.find((option) => option.value === level)

        return (
          <div className='flex justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className={`h-8 px-3 flex items-center space-x-2 rounded-full ${levelOption?.color}`}
                >
                  <GraduationCap className='w-4 h-4' />
                  <span>{level}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center' className='w-56'>
                <DropdownMenuLabel className='text-center'>Change Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={level}
                  onValueChange={(newLevel) => handleLevelChange(row.original.id, newLevel, level)}
                >
                  {levelOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className={`flex items-center space-x-2 ${option.color} rounded-md transition-colors`}
                      disabled={option.value === level}
                    >
                      <GraduationCap className='w-4 h-4' />
                      <span>{option.label}</span>
                      {option.value === level && <Check className='w-4 h-4 ml-auto' />}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      filterFn: (row, id, filterValues) => {
        if (!filterValues || filterValues.length === 0) return true
        const value = row.getValue(id)
        return filterValues.includes(value)
      }
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <div className='text-right'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='px-0 font-semibold hover:bg-transparent'
          >
            Price (USD)
            <ArrowUpDown className='w-4 h-4 ml-1' />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('price'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(amount)
        return <div className='text-right pr-4'>{formatted}</div>
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const course = row.original
        const isDraft = course.courseStatus === 'Draft'

        return (
          <div className='flex justify-end pr-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id)}>
                  <Copy className='mr-2 h-4 w-4' />
                  <span>Copy course ID</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className='mr-2 h-4 w-4' />
                  <span>View course details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isDraft && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({ to: '/edit-curriculum-course/$courseId', params: { courseId: course.id } })
                      }
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      <span>Edit Curriculum course</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: '/edit-basic-course/$courseId', params: { courseId: course.id } })}
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      <span>Edit Basic course</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteCourse(course.id)}>
                      <Trash className='mr-2 h-4 w-4' />
                      <span>Delete course</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]

  const table = useReactTable({
    data: courses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize
      }
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize)
  })

  const goToPage = useCallback((newPageIndex) => {
    setPageIndex(newPageIndex)
  }, [])

  return {
    table,
    isLoading,
    error,
    fetchCourses,
    pageIndex,
    setPageIndex: goToPage,
    pageSize,
    setPageSize,
    totalCount,
    isStatusChangeDialogOpen,
    setIsStatusChangeDialogOpen,
    handleScheduledStatusConfirm,
    handleStatusChange,
    selectedCourse,
    newStatus,
    columns,
    handleLevelChange
  }
}
