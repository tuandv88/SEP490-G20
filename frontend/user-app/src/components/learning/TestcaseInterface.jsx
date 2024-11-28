/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import useStore from '../../data/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TestResultLoading from '../loading/TestResultLoading'

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
const LoadingButton = styled.div`
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

const TestcaseInterface = ({ response, loading, testCase, setIsSuccessCode }) => {
  const [activeTab, setActiveTab] = useState('Testcase')
  const [activeTestCase, setActiveTestCase] = useState(0)
  const [activeTestResult, setActiveTestResult] = useState(0)
  const [testCases, setTestCases] = useState(testCase)
  const setStoreTestCases = useStore((state) => state.setTestCases)
  const activeTabTestcase = useStore((state) => state.activeTabTestcase)
  const setActiveTabTestcase = useStore((state) => state.setActiveTabTestcase)

  console.log('testCases', testCases)

  if (testCase[0] === null) {
    console.log('testCase[0] === null')
  }

  useEffect(() => {
    if (testCase) {
      setTestCases(testCase)
    }
  }, [testCase])

  useEffect(() => {
    const allPassed = response?.codeExecuteDto?.testResults?.every((result) => result.isPass !== false)
    setIsSuccessCode(allPassed)
  }, [response, activeTestResult, setIsSuccessCode])

  const handleAddTestCase = () => {
    const newId = Object.keys(testCases).length.toString()
    // Lấy test case đầu tiên làm mẫu
    const sampleTestCase = testCases[Object.keys(testCases)[0]]

    // Tạo test case mới với cùng cấu trúc nhưng giá trị rỗng
    const newTestCase = Object.keys(sampleTestCase).reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {})

    setTestCases((prev) => ({
      ...prev,
      [newId]: newTestCase
    }))
  }

  const handleRemoveTestCase = (id) => {
    if (Object.keys(testCases).length <= 1) return

    const updatedTestCases = {}
    let newIndex = 0

    Object.entries(testCases).forEach(([key, value]) => {
      if (key !== id) {
        updatedTestCases[newIndex.toString()] = value
        newIndex++
      }
    })

    setTestCases(updatedTestCases)
    if (parseInt(id) <= activeTestCase && activeTestCase > 0) {
      setActiveTestCase((prev) => prev - 1)
    }
  }

  const handleInputChange = (caseId, param, value) => {
    setTestCases((prev) => ({
      ...prev,
      [caseId]: { ...prev[caseId], [param]: value }
    }))
  }

  useEffect(() => {
    //console.log('Received result in TestcaseInterface:', response)
    //setData(testCases)
    setStoreTestCases(Object.values(testCases).map((inputs) => ({ inputs }))) // Cập nhật dữ liệu trong store
  }, [response, setStoreTestCases, testCases])

  return (
    <div className='bg-[#111827] p-4 shadow-md w-full h-full '>
      <div className='flex mb-4 border-b border-gray-600'>
        <button
          className={`px-4 py-2 text-sm font-bold ${
            activeTabTestcase === 'Testcase'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTabTestcase('Testcase')}
        >
          Testcase
        </button>
        <button
          className={`px-4 py-2 text-sm font-bold flex items-center ${
            activeTabTestcase === 'Test Result'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTabTestcase('Test Result')}
        >
          {loading ? (
            <>
              <LoadingButton loading={loading.toString()} disabled={loading} />
              <span style={{ marginLeft: '5px' }}>Running...</span>
            </>
          ) : (
            <>Test Result</>
          )}
        </button>
      </div>
      {activeTabTestcase === 'Testcase' && (
        <>
          <div className='p-4 bg-gray-800 rounded-lg'>
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
            <div className='flex mb-4 flex-wrap'>
              {Object.keys(testCases).map((caseId, index) => (
                <div key={caseId} className='relative mr-2 mb-2'>
                  <Button
                    variant={activeTestCase === index ? 'secondary' : 'outline'}
                    size='sm'
                    className='pr-6'
                    onClick={() => setActiveTestCase(index)}
                  >
                    Case {parseInt(caseId) + 1}
                  </Button>
                  {Object.keys(testCases).length > 1 && (
                    <Button
                      variant='destructive'
                      size='icon'
                      className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0'
                      onClick={() => handleRemoveTestCase(caseId)}
                    >
                      <X size={12} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant='outline' size='icon' className='h-9 w-9' onClick={handleAddTestCase}>
                <Plus size={16} />
              </Button>
            </div>
            <div className='bg-gray-100 rounded-md p-4'>
              {Object.entries(testCases[activeTestCase.toString()]).map(([param, value]) => (
                <div key={param} className='mb-4 last:mb-0'>
                  <Label htmlFor={`${param}-${activeTestCase}`} className='text-gray-700 mb-2 block'>
                    {param} =
                  </Label>
                  <Input
                    id={`${param}-${activeTestCase}`}
                    value={value}
                    onChange={(e) => handleInputChange(activeTestCase.toString(), param, e.target.value)}
                    className='bg-white p-2 rounded-md w-full'
                    placeholder={`Enter value for ${param}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {activeTabTestcase === 'Test Result' && (
        <div className='bg-gray-800 rounded-md p-4'>
          {loading && <TestResultLoading></TestResultLoading>}
          {!loading && response?.codeExecuteDto?.testResults && response.codeExecuteDto.testResults.length > 0 && (
            <>
              <div className='flex mb-4 flex-wrap'>
                {response.codeExecuteDto.testResults.map((result, index) => (
                  <div key={index} className='relative mr-2 mb-2'>
                    <Button
                      variant={activeTestResult === index ? 'secondary' : 'outline'}
                      size='sm'
                      className={`${response.codeExecuteDto.testResults[activeTestResult].isPass ? 'bg-green-400' : 'bg-red-100'}`}
                      onClick={() => setActiveTestResult(index)}
                    >
                      Case {index + 1}
                    </Button>
                  </div>
                ))}
              </div>
              <div className='bg-gray-100 rounded-md p-4'>
                <div
                  className={`mb-4 p-4 rounded-md ${response.codeExecuteDto.testResults[activeTestResult].isPass ? 'bg-green-100' : 'bg-red-100'}`}
                >
                  {Object.entries(response.codeExecuteDto.testResults[activeTestResult].inputs).map(
                    ([param, value]) => (
                      <p key={param} className='text-gray-700 mb-2'>
                        {param} = {value}
                      </p>
                    )
                  )}
                  <p className='text-gray-700 mb-2'>
                    Output: {response.codeExecuteDto.testResults[activeTestResult].output}
                  </p>
                  <p className='text-gray-700 mb-2'>
                    Expected: {response.codeExecuteDto.testResults[activeTestResult].expected}
                  </p>
                  <p className='text-gray-700'>
                    Stdout: {response.codeExecuteDto.testResults[activeTestResult].stdout}
                  </p>
                </div>
              </div>
            </>
          )}

          {!loading && response?.codeExecuteDto?.compileErrors && (
            <div>
              <h2 className='text-2xl font-bold text-red-500 mb-4'>Compile Error</h2>
              <pre className='bg-red-100 p-4 rounded-md text-red-700 whitespace-pre-wrap'>
                {response.codeExecuteDto.compileErrors}
              </pre>
            </div>
          )}

          {!loading && response?.codeExecuteDto?.runTimeErrors && (
            <div>
              <h2 className='text-2xl font-bold text-red-500 mb-4'>Runtime Error</h2>
              <pre className='bg-red-100 p-4 rounded-md text-red-700 whitespace-pre-wrap'>
                {response.codeExecuteDto.runTimeErrors}
              </pre>
            </div>
          )}

          {!loading && response?.codeExecuteDto?.status?.description === 'Accepted' && (
            <div>
              <h2 className='text-2xl font-bold text-green-500 mb-4'>Accepted</h2>
              <pre className='bg-green-100 p-4 rounded-md text-green-700 whitespace-pre-wrap'>
                {response.codeExecuteDto.status.description}
              </pre>
            </div>
          )}

          {!loading && response?.codeExecuteDto?.status?.description !== 'Accepted' && (
            <div>
              <h2 className='text-2xl font-bold text-red-500 mb-4'>Failed</h2>
              <pre className='bg-red-100 p-4 rounded-md text-red-700 whitespace-pre-wrap'>
                {response.codeExecuteDto.status.description}
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

export default TestcaseInterface
