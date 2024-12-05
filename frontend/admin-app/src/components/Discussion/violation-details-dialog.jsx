import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react'

export function ViolationDetailsDialog({ isOpen, onClose, details }) {
  const getViolationLevelInfo = (level) => {
    switch (level) {
      case 1:
        return { label: 'Low', color: 'bg-yellow-100 text-yellow-800', icon: InfoIcon }
      case 2:
        return { label: 'Medium', color: 'bg-orange-100 text-orange-800', icon: AlertTriangleIcon }
      case 3:
        return { label: 'High', color: 'bg-red-100 text-red-800', icon: AlertTriangleIcon }
      default:
        return { label: 'None', color: 'bg-gray-100 text-gray-800', icon: InfoIcon }
    }
  }

  const violationInfo = getViolationLevelInfo(details.violationLevel)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] p-0'>
        <DialogHeader className='px-6 pt-6 pb-4 bg-gray-50 dark:bg-gray-800'>
          <DialogTitle className='text-2xl font-semibold flex items-center space-x-2'>
            <AlertTriangleIcon className='w-6 h-6 text-red-500' />
            <span>Violation Details</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[60vh] px-6 py-4'>
          <div className='space-y-6'>
            <div className='flex items-start space-x-4'>
              <CalendarIcon className='w-5 h-5 mt-0.5 text-gray-500' />
              <div>
                <h3 className='font-semibold text-sm text-gray-700 dark:text-gray-300'>Flagged Date</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {format(new Date(details.flaggedDate), 'HH:mm, dd MMMM yyyy')}
                </p>
              </div>
            </div>
            <div className='flex items-start space-x-4'>
              <violationInfo.icon className={`w-5 h-5 mt-0.5 ${violationInfo.color}`} />
              <div>
                <h3 className='font-semibold text-sm text-gray-700 dark:text-gray-300'>Violation Level</h3>
                <Badge className={`mt-1 ${violationInfo.color}`}>{violationInfo.label}</Badge>
              </div>
            </div>
            <div className='flex items-start space-x-4'>
              <InfoIcon className='w-5 h-5 mt-0.5 text-gray-500' />
              <div>
                <h3 className='font-semibold text-sm text-gray-700 dark:text-gray-300'>Reason</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{details.reason}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
