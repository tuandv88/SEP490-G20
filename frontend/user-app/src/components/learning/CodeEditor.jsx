/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import TestcaseInterface from './TestcaseInterface'
import PreferenceNav from './PreferenceNav'
import useStore from '../../data/store'
import lodash, { isEmpty } from 'lodash'
import { LearningAPI } from '@/services/api/learningApi'
import Popup from '../ui/popup'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'

const CodeEditor = ({ templates, arrayTestcase, problemId }) => {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState()
  const [testCase, setTestCase] = useState({ 0: { l1: '9 9 9 9', l2: '9 9 9' } })
  const testCases = useStore((state) => state.testCases)
  const [isOpen, setIsOpen] = useState(false)


  const handleEditorChange = lodash.debounce((value) => {
    setCode(value)
  }, 1000)

  const handleArrayToDictionary = (inputArray) => {
    if (!Array.isArray(inputArray)) {
      return
    }

    const dictionary = inputArray.reduce((acc, item, index) => {
      acc[index] = item.inputs
      return acc
    }, {})
    setTestCase(dictionary)
  }

  const handleRunCode = async () => {
    if (!code || isEmpty(code)) {
      setIsOpen(true)
      return
    }

    const submissionData = {
      createCodeExecuteDto: {
        languageCode: 'Java',
        solutionCode: code,
        testCases: testCases
      }
    }

    setLoading(true)
    try {
      const data = await LearningAPI.excuteCode(problemId, submissionData)
      setResponse(data)
    } catch (error) {
      console.error('Error submitting code:', error)
      alert('Error occurred while submitting code')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Hàm gọi API
    const fetchProblem = async () => {
      setCode(templates)
      handleArrayToDictionary(arrayTestcase)
    }
    fetchProblem()
  }, [arrayTestcase, templates])

  useEffect(() => {
    console.log('Updated testCase:', testCase)
  }, [testCase])

  return (
    <div className='flex flex-col bg-gray-900 h-full'>
      <PreferenceNav className='h-full' onSubmit={handleRunCode} loading={loading} />

      <ResizablePanelGroup direction='vertical'>
        <ResizablePanel defaultSize={60}>
          <div className='w-full h-full overflow-auto'>
            <Editor
              height='100%'
              defaultLanguage='java'
              value={code}
              onChange={handleEditorChange}
              theme='vs-dark'
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBars: 'visible',
                cursorStyle: 'line',
                rulers: [80],
                wordWrap: 'on'
              }}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className='h-[3px] resize-sha overflow-hidden bg-slate-300' />
        <ResizablePanel defaultSize={40}>
          <div className='h-full w-full overflow-auto'>
            <TestcaseInterface response={response} loading={loading} testCase={testCase}></TestcaseInterface>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message='The source code is empty. Please choose one lecture.'
      />
    </div>
  )
}

export default React.memo(CodeEditor)
