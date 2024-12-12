import React, { useState } from 'react'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import { Check, X, Copy, CheckCheck } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const PreCoppy = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className='absolute top-2 right-2 p-2 hover:bg-gray-700 rounded-lg'
    >
      {copied ? (
        <CheckCheck className='h-4 w-4 text-green-500' />
      ) : (
        <Copy className='h-4 w-4 text-gray-400' />
      )}
    </button>
  )
}

const SubmissionHistoryProblem = ({ submissions }) => {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = parseISO(dateStr)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true })
      }
      return format(date, 'MMM dd, yyyy')
    } catch (error) {
      return 'Invalid date'
    }
  }

  const formatMemory = (bytes) => {
    return (bytes / 1024).toFixed(2) + ' MB'
  }

  const getStatus = (submission) => {
    if (submission.status?.description) {
      return submission.status.description
    }
    
    if (submission.testCasePass === submission.totalTestCase && submission.totalTestCase > 0) {
      return 'Accepted'
    }
    if (submission.compileErrors) {
      return 'Compile Error'
    }
    if (submission.runTimeErrors) {
      return 'Runtime Error' 
    }
    return 'Wrong Answer'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600'
      case 'Compile Error':
      case 'Runtime Error':
        return 'text-yellow-600'
      default:
        return 'text-red-600'
    }
  }

  const handleRowClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const formatCodeToMarkdown = (code) => {
    return `\`\`\`java\n${code}\n\`\`\``
  }

  return (
    <div className='overflow-x-auto w-[100%] bg-bGprimary shadow h-full'>
      {!submissions || submissions.length === 0 ? (
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
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Test Cases</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#1b2a32' }} className='divide-y divide-gray-200'>
            {submissions.map((submission, index) => {
              const status = getStatus(submission)
              const statusColor = getStatusColor(status)

              return (
                <React.Fragment key={index}>
                  <tr 
                    className='hover:bg-gray-700 cursor-pointer' 
                    onClick={() => handleRowClick(index)}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className={`flex items-center ${statusColor}`}>
                        {status === 'Accepted' ? <Check className='w-4 h-4 mr-2' /> : <X className='w-4 h-4 mr-2' />}
                        <div className={`flex flex-col items-start ${statusColor}`}>
                          <span className='font-medium text-white'>{status}</span>
                          <span className='text-sm text-gray-400'>
                            {submission.submissionDate ? formatDate(submission.submissionDate) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                        {submission.languageCode || submission.language}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>
                      {submission.executionTime ? `${submission.executionTime} ms` : 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>
                      {submission.memoryUsage ? formatMemory(submission.memoryUsage) : 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>
                      {`${submission.testCasePass || 0}/${submission.totalTestCase || 0}`}
                    </td>
                  </tr>
                  {expandedIndex === index && (
                    <tr>
                      <td colSpan={6} className='px-6 py-4 bg-gray-800'>
                        <div className='overflow-x-auto'>
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                  <div className='relative'>
                                    <SyntaxHighlighter 
                                      style={oneDark} 
                                      language={match[1]} 
                                      PreTag='div' 
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                    <PreCoppy code={String(children)} />
                                  </div>
                                ) : (
                                  <code
                                    className='bg-gray-200 inline-block text-black rounded px-1 py-0.3 text-sm font-mono opacity-60'
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              }
                            }}
                          >
                            {formatCodeToMarkdown(submission.sourceCode)}
                          </ReactMarkdown>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SubmissionHistoryProblem
