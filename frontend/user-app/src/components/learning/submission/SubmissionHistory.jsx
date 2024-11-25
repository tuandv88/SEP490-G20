import React, { useEffect, useState } from 'react'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { Check, X } from 'lucide-react'

const SubmissionHistory = ({ submissions }) => {
  const formatDate = (dateStr) => {
    const date = parseISO(dateStr)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true })
    }
    return format(date, 'MMM dd, yyyy')
  }

  const formatMemory = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getStatus = (submission) => {
    if (submission.testCasePassCount === submission.totalTestCase) {
      return 'Accepted'
    }
    return 'Wrong Answer'
  }

  const getStatusColor = (status) => {
    return status === 'Accepted' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className='overflow-x-auto w-[100%] bg-bGprimary rounded-lg shadow'>
      <table className='w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Language</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Runtime</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Memory</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {submissions.map((submission, index) => {
            const status = getStatus(submission)
            const statusColor = getStatusColor(status)

            return (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className={`flex items-center ${statusColor}`}>
                    {status === 'Accepted' ? <Check className='w-4 h-4 mr-2' /> : <X className='w-4 h-4 mr-2' />}
                    <div className={`flex flex-col items-start ${statusColor}`}>
                      <span className='font-medium'>{status}</span>
                      <span className='text-sm text-gray-500'>{formatDate(submission.submissionDate)}</span>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                    {submission.language}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {submission.runTimeErrors || submission.compileErrors ? 'N/A' : `${submission.executionTime} ms`}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {formatMemory(submission.memoryUsage)}
                </td>               
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SubmissionHistory
