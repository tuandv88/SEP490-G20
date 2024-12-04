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
    return (bytes / 1024).toFixed(2) + ' MB'
  }

  console.log(submissions)

  const getStatus = (submission) => {
    if (
      (submission.testCasePassCount === submission.totalTestCase && submission.totalTestCase !== 0) ||
      (submission.compileErrors === null &&
        submission.runTimeErrors === null &&
        submission.testCasePassCount === 0 &&
        submission.totalTestCase === 0)
    ) {
      return 'Accepted'
    }
    return 'Wrong Answer'
  }

  const getStatusColor = (status) => {
    return status === 'Accepted' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className='overflow-x-auto w-[100%] bg-bGprimary shadow h-full'>
      {submissions.length === 0 ? (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <p>No submission history available.</p>
        </div>
      ) : (
        <table className='w-full divide-y divide-gray-200'>
          <thead style={{ backgroundColor: '#1b2a32' }}>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Status</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Language</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Runtime</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Memory</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#1b2a32' }} className='divide-y divide-gray-200'>
            {submissions.map((submission, index) => {
              const status = getStatus(submission)
              const statusColor = getStatusColor(status)

              return (
                <tr key={index} className='hover:bg-gray-700'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className={`flex items-center ${statusColor}`}>
                      {status === 'Accepted' ? <Check className='w-4 h-4 mr-2' /> : <X className='w-4 h-4 mr-2' />}
                      <div className={`flex flex-col items-start ${statusColor}`}>
                        <span className='font-medium text-white'>{status}</span>
                        <span className='text-sm text-gray-400'>{formatDate(submission.submissionDate)}</span>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {submission.language}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>
                    {submission.runTimeErrors || submission.compileErrors ? 'N/A' : `${submission.executionTime} ms`}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>
                    {formatMemory(submission.memoryUsage)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SubmissionHistory
