import React from 'react'
import { Check, X } from 'lucide-react'

export default function SubmissionResult({ currentCode, resultCodeSubmit }) {
  console.log(resultCodeSubmit)
  return (
    <div className='bg-[#1b2a32] h-full'>
      {resultCodeSubmit ? (
        <>
          <div className='p-6 border-b border-[#243b4a]'>
            <div className='flex items-center gap-2 mb-2'>
              {resultCodeSubmit?.status?.description === 'Accepted' ? (
                <>
                  <Check className='w-6 h-6 text-green-400' />
                  <span className='text-xl font-semibold text-green-400'>Accepted</span>
                </>
              ) : (
                <>
                  <X className='w-6 h-6 text-red-400' />
                  <span className='text-xl font-semibold text-red-400'>Wrong Answer</span>
                </>
              )}
            </div>
            <div className='flex flex-col gap-1 text-gray-400 text-sm'>
              <div>
                {resultCodeSubmit?.testCasePass} / {resultCodeSubmit?.totalTestCase} testcases passed
              </div>
              <div className='flex gap-4'>
                <span>Time: {resultCodeSubmit?.executionTime}ms</span>
                <span>Memory: {(resultCodeSubmit?.memoryUsage / 1024).toFixed(2)}MB</span>
              </div>
            </div>
          </div>

          {resultCodeSubmit?.testFail && (
            <div className='p-6 border-b border-[#243b4a]'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-gray-400 mb-2 text-sm font-medium'>Input</h3>
                  {Object.entries(resultCodeSubmit?.testFail?.inputs).map(([key, value]) => (
                    <div key={key} className='bg-[#243b4a] p-3 rounded-md text-gray-200 mb-2'>
                      {key} = {value}
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className='text-gray-400 mb-2 text-sm font-medium'>Output</h3>
                  <div className='bg-[#243b4a] p-3 rounded-md text-gray-200'>{resultCodeSubmit?.testFail?.output}</div>
                </div>

                <div>
                  <h3 className='text-gray-400 mb-2 text-sm font-medium'>Expected</h3>
                  <div className='bg-[#243b4a] p-3 rounded-md text-gray-200'>
                    {resultCodeSubmit?.testFail?.expected}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='p-6'>
            <pre className='bg-[#243b4a] p-4 rounded-md overflow-x-auto'>
              <code className='text-gray-200'>{currentCode}</code>
            </pre>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <p>No results available. Please submit your code to see the results.</p>
        </div>
      )}
    </div>
  )
}
