'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Split from 'react-split'
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import CodeEditorPanel from './CodeEditorPanel'
import TestPanel from './TestPanel'
import TestCaseResultPanel from './TestCaseResultPanel'
import { FileDialogs } from './FileDialogs'
import TestCaseGenerator from './code-section'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import CodeEditor from '@/pages/CourseTest/CodeEditor'

export default function AuthorSolutionStep({
  form,
  solutionCode,
  setSolutionCode,
  testCode,
  setTestCode,
  testResult,
  runCode,
  onSubmit
}) {
  const [files, setFiles] = useState([{ name: 'Solution.java', content: solutionCode }])
  const [activeFile, setActiveFile] = useState('Solution.java')
  const [activeTestCase, setActiveTestCase] = useState('case-1')
  const [activeTab, setActiveTab] = useState('testcase')
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [fileToManage, setFileToManage] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const [testCases, setTestCases] = useState([
    {
      id: 'case-1',
      name: 'Case 1',
      inputs: [
        { name: 'nums', value: '[2,7,11,15]' },
        { name: 'target', value: '9' }
      ]
    }
  ])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleAddFile = () => {
    if (newFileName.trim()) {
      setFiles((prev) => [...prev, { name: newFileName, content: '' }])
      setActiveFile(newFileName)
      setNewFileName('Solution.java')
      setIsNewFileDialogOpen(false)
    }
  }

  const handleRenameFile = () => {
    if (newFileName.trim() && fileToManage) {
      setFiles((prev) => prev.map((file) => (file.name === fileToManage.name ? { ...file, name: newFileName } : file)))
      setActiveFile(newFileName)
      setNewFileName('')
      setFileToManage(null)
     
    }
  }

  const handleDeleteFile = () => {
    if (fileToManage && files.length > 1) {
      const newFiles = files.filter((file) => file.name !== fileToManage.name)
      setFiles(newFiles)
      setActiveFile(newFiles[0].name)
      setFileToManage(null)
      
    }
  }

  const handleSolutionCodeChange = (value) => {
    setFiles((prev) => prev.map((file) => (file.name === activeFile ? { ...file, content: value || '' } : file)))
    setSolutionCode(value || '')
  }

  return (
    //h-[calc(100vh-4rem)]
    <div className='flex flex-col '>
      

      {/* Header */}
      <div className='flex items-center justify-end gap-2 p-2 border-b bg-background shrink-0'>
        <Button
          onClick={runCode}
          variant='outline'
          size='sm'
          className='transition-colors hover:bg-primary hover:text-primary-foreground'
        >
          <RotateCcw className='w-4 h-4 mr-1' />
          Run Code
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          variant='outline'
          size='sm'
          className='transition-colors hover:bg-primary hover:text-primary-foreground'
        >
          Submit
        </Button>
      </div>

      {/* Main Content */}
      <div className='flex flex-col  flex-grow '>
        
        <div className='flex-grow overflow-hidden min-h-[500px]'>
          <Split
            sizes={[50, 50]}
            // minSize={[300, 300]}
            maxSize={[Infinity, Infinity]}
            gutterSize={4}
            className='flex w-full h-full'
            direction='horizontal'
            gutter={() => {
              const gutter = document.createElement('div')
              gutter.className =
                'bg-zinc-800 hover:bg-zinc-600 transition-colors duration-150 ease-in-out w-[4px] cursor-col-resize'
              return gutter
            }}
          >
           
            <CodeEditorPanel
              title='Solution'
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              // handleAddFile={handleAddFile}
              setIsNewFileDialogOpen={setIsNewFileDialogOpen}
              setFileToManage={setFileToManage}
              setIsRenameDialogOpen={setIsRenameDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              handleSolutionCodeChange={handleSolutionCodeChange}
            />

            
            <TestPanel testCode={testCode} setTestCode={setTestCode} />
          </Split>
          
        </div>

       
        <div className='h-64 overflow-y-auto border-t border-zinc-800 mb-20'>
          <TestCaseResultPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            testCases={testCases}
            activeTestCase={activeTestCase}
            setActiveTestCase={setActiveTestCase}
            testResult={testResult}
          />
        </div>
      </div>

      

      <ResizablePanelGroup direction='vertical' className='min-h-[1000px] rounded-lg border h-full'>
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel defaultSize={50}>
              <div className='flex h-full items-center justify-center'>
                <CodeEditorPanel
                  title='Solution'
                  files={files}
                  activeFile={activeFile}
                  setActiveFile={setActiveFile}
                  // handleAddFile={handleAddFile}
                  setIsNewFileDialogOpen={setIsNewFileDialogOpen}
                  setFileToManage={setFileToManage}
                  setIsRenameDialogOpen={setIsRenameDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  handleSolutionCodeChange={handleSolutionCodeChange}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className='flex h-full items-center justify-center'>
                <TestPanel testCode={testCode} setTestCode={setTestCode} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} className='bg-zinc-800'>
          <div>
              <TestCaseResultPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                testCases={testCases}
                activeTestCase={activeTestCase}
                setActiveTestCase={setActiveTestCase}
                testResult={testResult}
              />
            </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <FileDialogs
        isNewFileDialogOpen={isNewFileDialogOpen}
        setIsNewFileDialogOpen={setIsNewFileDialogOpen}
        isRenameDialogOpen={isRenameDialogOpen}
        setIsRenameDialogOpen={setIsRenameDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        newFileName={newFileName}
        setNewFileName={setNewFileName}
        fileToManage={fileToManage}
        setFileToManage={setFileToManage}
        handleAddFile={handleAddFile}
        handleRenameFile={handleRenameFile}
        handleDeleteFile={handleDeleteFile}
      />
    </div>
  )
}
