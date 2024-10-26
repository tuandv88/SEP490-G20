/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import LoadingSkeleton from '../loading/LoadingSkeleton'
import styled, { keyframes } from 'styled-components'

// Định nghĩa animation xoay
const spinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);  // Bắt đầu ở vị trí 0 độ
  }
  100% {
    transform: rotate(360deg); // Kết thúc ở vị trí 360 độ
  }
`

// Tạo button với hiệu ứng loading
const LoadingButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  // Phong cách cho vòng tròn xoay loading
  &::after {
    content: '';
    display: ${(props) => (props.loading ? 'inline-block' : 'none')};
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spinnerAnimation} 0.75s linear infinite; // Hiệu ứng xoay
    position: absolute;
    right: 0.5rem; // Vị trí của spinner
  }
`

const TestcaseInterface = ({ response, loading }) => {
  const [activeTab, setActiveTab] = useState('Testcase')
  const [activeTestCase, setActiveTestCase] = useState(0)
  const [testCases, setTestCases] = useState([
    { id: 1, input: '4' },
    { id: 2, input: '5' },
    { id: 3, input: '6' }
  ])

  const [testResult, setTestResult] = useState({
    status: 'Acceptedd',
    details: null
  })

  const handleAddTestCase = () => {
    const newId = testCases.length + 1
    setTestCases([...testCases, { id: newId, input: '' }])
  }

  useEffect(() => {
    console.log('Received result in TestcaseInterface:', response)
  }, [response])

  return (
    <div className='bg-[#111827] p-4 shadow-md w-full h-full'>
      <div className='flex mb-4 border-b border-gray-600'>
        <button
          className={`px-4 py-2 text-sm font-bold ${
            activeTab === 'Testcase' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('Testcase')}
        >
          Testcase
        </button>
        <button
          className={`px-4 py-2 text-sm font-bold flex items-center ${
            activeTab === 'Test Result'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('Test Result')}
        >
          {loading ? (
            <>
              <LoadingButton loading={loading} disabled={loading} />
              <span style={{ marginLeft: '5px' }}>Running...</span>
            </>
          ) : (
            <>Test Result</>
          )}
        </button>
      </div>
      {activeTab === 'Testcase' && (
        <>
          <div className='flex items-center mb-4'>
            <svg className='w-5 h-5 text-green-500 mr-2' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-semibold text-white'>Testcase</span>
          </div>
          <div className='flex mb-4'>
            {testCases.map((testCase, index) => (
              <button
                key={testCase.id}
                className={`mr-2 px-3 py-1 rounded-md text-sm ${
                  activeTestCase === index ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTestCase(index)}
              >
                Case {testCase.id}
              </button>
            ))}
            <button
              className='px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200'
              onClick={handleAddTestCase}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className='bg-gray-100 rounded-md p-4'>
            <p className='text-gray-700 mb-2'>n =</p>
            <div className='bg-white p-2 rounded-md'>
              <p className='text-gray-800'>{testCases[activeTestCase].input}</p>
            </div>
          </div>
        </>
      )}
      {activeTab === 'Test Result' && (
        <div className='bg-gray-100 rounded-md p-4'>
          {loading && <ResultLoading></ResultLoading>}

          {!loading && response?.submissionResponse?.stdout && (
            <div>
              <h2 className='text-2xl font-bold text-green-500 mb-4'>Success</h2>
              <p className='text-gray-700 mb-2'>Runtime: {response?.submissionResponse?.time} ms</p>
              <pre className='bg-green-200 p-4 rounded-md text-black whitespace-pre-wrap'>
                {response?.submissionResponse?.stdout}
              </pre>
              {/* {testResult.details.cases.map((testCase) => (
                <div
                  key={testCase.id}
                  className="mb-4 p-4 bg-white rounded-md shadow"
                >
                  <h3 className="font-semibold mb-2">Case {testCase.id}</h3>
                  <p className="text-gray-700">
                    Input: nums = {testCase.input}
                  </p>
                  <p className="text-gray-700">target = {testCase.target}</p>
                  <p className="text-gray-700">Output: {testCase.output}</p>
                </div>
              ))} */}
            </div>
          )}

          {!loading && response?.submissionResponse?.compile_output && (
            <div>
              <h2 className='text-2xl font-bold text-red-500 mb-4'>Compile Error</h2>
              <pre className='bg-red-100 p-4 rounded-md text-red-700 whitespace-pre-wrap'>
                {response?.submissionResponse?.compile_output}
              </pre>
            </div>
          )}

          {!loading && response === null && (
            <div>
              <pre className='bg-red-100 p-4 rounded-md text-gray-700 whitespace-pre-wrap'>
                You must run your code first
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ResultLoading = () => {
  return (
    <div>
      <h2 className=' mb-4'>
        <LoadingSkeleton height='32px' className='w-full'></LoadingSkeleton>
      </h2>
      <pre className='rounded-md whitespace-pre-wrap overflow-hidden'>
        <LoadingSkeleton height='62px' className='w-full'></LoadingSkeleton>
      </pre>
    </div>
  )
}

export default TestcaseInterface
