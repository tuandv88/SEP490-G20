/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import TestcaseInterface from './TestcaseInterface'
import PreferenceNav from './PreferenceNav'
import axios from 'axios'

const CodeEditor = () => {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`)

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleSubmitCode = async () => {
    const submissionData = {
      submissionDto: {
        problemId: 1,
        languageId: 4,
        sourceCode: code,
        stdin: 'string'
      }
    }

    setLoading(true)

    try {
      const res = await axios.post('https://localhost:5000/learning-service/submission', submissionData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      setResponse(res.data)
      console.log(res.data)
      //console.log("Error: " + response.submissionResponse.compile_output);
    } catch (error) {
      console.error('Error submitting code:', error)
      alert('Error occurred while submitting code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='lex flex-col bg-gray-900'>
      <PreferenceNav onSubmit={handleSubmitCode} loading={loading} />
      <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 46]} minSize={60} gutterSize={3}>
        <div className='w-full overflow-auto'>
          <Editor
            height='100%'
            defaultLanguage='c'
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
        <div className='h-full w-full overflow-auto'>
          <TestcaseInterface response={response} loading={loading}></TestcaseInterface>
        </div>
      </Split>
    </div>
  )
}

export default CodeEditor
