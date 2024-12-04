/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
// import Editor from '@monaco-editor/react'
import TestcaseInterface from './TestcaseInterface'
import PreferenceNav from './PreferenceNav'
import useStore from '../../data/store'
import lodash, { isEmpty } from 'lodash'
import { LearningAPI } from '@/services/api/learningApi'
import Popup from '../ui/popup'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import Editor from '@/lib/code-editor/components/Editor'
import { JAVA_LANGUAGE_CONFIG, JAVA_LANGUAGE_EXT_POINT, JAVA_LANGUAGE_ID } from '@/lib/code-editor/constants'

const CodeEditor = ({
  templates,
  arrayTestcase,
  problemId,
  setIsSuccessCode,
  isSuccessCode,
  setActiveTab,
  setResultCodeSubmit,
  setCurrentCode
}) => {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState()
  const [testCase, setTestCase] = useState({ 0: { l1: '9 9 9 9', l2: '9 9 9' } })
  const testCases = useStore((state) => state.testCases)
  const [isOpen, setIsOpen] = useState(false)
  const setCodeRun = useStore((state) => state.setCodeRun)
  const setCodeResponse = useStore((state) => state.setCodeResponse)
  const setActiveTabTestcase = useStore((state) => state.setActiveTabTestcase)

  const handleEditorChange = lodash.debounce((value) => {
    setCode(value)
    setCodeRun(value)
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
    setActiveTabTestcase('Test Result')
    setLoading(true)
    try {
      const data = await LearningAPI.excuteCode(problemId, submissionData)
      setResponse(data)
      setCodeResponse(data)
      console.log('data', data)
    } catch (error) {
      console.error('Error submitting code:', error)
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
    //console.log('Updated testCase:', testCase)
  }, [testCase])

  console.log(testCase)

  return (
    <div className='flex flex-col bg-gray-900 h-full'>
      <PreferenceNav
        className='h-full'
        onSubmit={handleRunCode}
        loading={loading}
        isSuccessCode={isSuccessCode}
        problemId={problemId}
        setActiveTab={setActiveTab}
        setResultCodeSubmit={setResultCodeSubmit}
        setCurrentCode={setCurrentCode}
      />

      <ResizablePanelGroup direction='vertical'>
        <ResizablePanel defaultSize={60}>
          <div className='w-full h-full overflow-auto'>
            <Editor
              langConfig={{
                extPoint: JAVA_LANGUAGE_EXT_POINT,
                langId: JAVA_LANGUAGE_ID,
                langConfig: JAVA_LANGUAGE_CONFIG
              }}
              vsCodeSettingsJson={JSON.stringify({
                'editor.fontSize': 14,
                'editor.lineHeight': 20,
                'editor.fontFamily': 'monospace',
                'editor.fontWeight': 'normal',
                'editor.indentSize': 'tabSize',
                'workbench.colorTheme': 'Default Dark Modern',
                'editor.guides.bracketPairsHorizontal': 'active',
                'editor.experimental.asyncTokenization': true
              })}
              connectConfig={{
                fileUri: 'home/mlc/packages/examples/resources/eclipse.jdt.ls/workspace/ICoderVN/src/Solution.java',
                url: 'wss://lsp.icoder.vn/jdtls',
                workspaceUri: 'home/mlc/packages/examples/resources/eclipse.jdt.ls/workspace/ICoderVN'
              }}
              initValue={templates}
              containerId={'editor'}
              onChange={handleEditorChange}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className='h-[3px] resize-sha overflow-hidden bg-slate-300' />
        <ResizablePanel defaultSize={40}>
          <div className='h-full w-full overflow-auto'>
            <TestcaseInterface
              response={response}
              loading={loading}
              testCase={testCase}
              setIsSuccessCode={setIsSuccessCode}
            ></TestcaseInterface>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message='The source code is empty. Please write your code.'
      />
    </div>
  )
}

export default React.memo(CodeEditor)
