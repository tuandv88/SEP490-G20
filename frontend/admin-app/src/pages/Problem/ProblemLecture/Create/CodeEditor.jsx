'use client'

import * as React from 'react'
import {
  Code,
  TestTube2,
  Plus,
  X,
  Play,
  ChevronDown,
  CircleX,
  CircleCheck,
  XCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import Editor from '@monaco-editor/react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import TestCaseGenerator from '@/components/CreateCourse/CreateCodeProblem/code-section'
import { useToast } from '@/hooks/use-toast'
import { runCode } from '@/services/api/codeApi'
import { transformTestCases, transformTestScript } from '@/lib/utils'
import TestResultLoading from '@/components/loading/TestResultLoading'
import { ToastAction } from '@/components/ui/toast'

const TestCaseSelector = ({ testCases, selectedIndex, onSelect, failedTestCases = [] }) => (
  <div className='flex items-center gap-2 flex-wrap'>
    {testCases.map((_, index) => (
      <Button
        key={index}
        type='button'
        variant={selectedIndex === index ? 'default' : 'outline'}
        className={`${
          failedTestCases.includes(index)
            ? 'bg-red-100 hover:bg-red-200 text-red-700'
            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
        } ${selectedIndex === index ? 'border-2 border-emerald-500' : ''}`}
        onClick={() => onSelect(index)}
      >
        Case {index + 1}
      </Button>
    ))}
  </div>
)

const TestCaseDisplay = ({ result }) => (
  <div className='space-y-4'>
    <div>
      <div className='text-sm text-muted-foreground mb-2'>Inputs:</div>
      {Object.entries(result.inputs).map(([key, value]) => (
        <div key={key} className='mb-2'>
          <div className='text-sm text-muted-foreground'>{key} =</div>
          <Input className='font-mono bg-muted' value={value} readOnly />
        </div>
      ))}
    </div>
    <div>
      <div className='text-sm text-muted-foreground mb-2'>Expected Output =</div>
      <Input className='font-mono bg-muted' value={result.expected} readOnly />
    </div>
    {result && (
      <>
        <div>
          <div className='text-sm text-muted-foreground mb-2'>Actual Output =</div>
          <Input className='font-mono bg-muted' value={result.output} readOnly />
        </div>
        <div className={`flex items-center gap-2 ${result.isPass ? 'text-green-600' : 'text-red-600'}`}>
          {result.isPass ? <CheckCircle2 className='w-5 h-5' /> : <XCircle className='w-5 h-5' />}
          <span>{result.isPass ? 'Passed' : 'Failed'}</span>
        </div>
      </>
    )}
  </div>
)

const SolutionSelector = ({ solutions, selectedIndex, onSelect, failedSolutions = [] }) => (
  <div className='flex items-center gap-2 flex-wrap mb-4'>
    {solutions.map((_, index) => (
      <Button
        key={index}
        type='button'
        variant={selectedIndex === index ? 'default' : 'outline'}
        className={`${
          failedSolutions.includes(index)
            ? 'bg-red-100 hover:bg-red-200 text-red-700'
            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
        } ${selectedIndex === index ? 'border-2 border-blue-500' : ''}`}
        onClick={() => onSelect(index)}
      >
        Solution {index + 1}
      </Button>
    ))}
  </div>
)

const SolutionResult = ({ result }) => (
  <div className='space-y-4 mt-4'>
    <div>
      <div className='text-sm font-medium'>Status: </div>
      <span className={result.status.id === 3 ? 'text-green-600' : 'text-red-600'}>{result.status.description}</span>
    </div>
    {result.compileErrors && (
      <div>
        <div className='text-sm font-medium text-red-600'>Compile Errors: </div>
        <pre className='bg-red-100 p-2 rounded text-sm overflow-x-auto'>{result.compileErrors}</pre>
      </div>
    )}
    {result.runTimeErrors && (
      <div>
        <div className='text-sm font-medium text-red-600'>Runtime Errors: </div>
        <pre className='bg-red-100 p-2 rounded text-sm overflow-x-auto'>{result.runTimeErrors}</pre>
      </div>
    )}
  </div>
)

const CodeEditor = ({ form, setIsRunSuccess }) => {
  const [files, setFiles] = React.useState([{ name: 'Solution.java', content: '' }])
  const [activeFile, setActiveFile] = React.useState('Solution.java')
  const [testContent, setTestContent] = React.useState('')
  const [testCaseTab, setTestCaseTab] = React.useState('testcase')
  const [selectedCaseIndex, setSelectedCaseIndex] = React.useState(0)
  const [isSuccess, setIsSuccess] = React.useState(null)
  const [testCases, setTestCases] = React.useState([])
  const [selectedSolutionIndex, setSelectedSolutionIndex] = React.useState(0)
  const [testResults, setTestResults] = React.useState(null)
  const [isRunning, setIsRunning] = React.useState(false)

  const { toast } = useToast()
  const { setValue } = form

  console.log(testCases)
  const handleAddFile = () => {
    const lastFileNumber = Math.max(
      ...files.map((file) => {
        const match = file.name.match(/Solution(\d+)\.java/)
        return match ? parseInt(match[1]) : 0
      })
    )
    const newFileName = `Solution${lastFileNumber + 1}.java`
    setFiles((prev) => [...prev, { name: newFileName, content: '' }])
    setActiveFile(newFileName)
    setIsRunSuccess(false)
  }

  const isReadyToRun = () => {
    const areFilesNonEmpty = files.every((file) => file.content.trim() !== '')
    const isTestContentNonEmpty = testContent.trim() !== ''
    return areFilesNonEmpty && isTestContentNonEmpty
  }

  const handleDeleteFile = (fileName) => {
    if (files.length > 1) {
      const indexToDelete = files.findIndex((file) => file.name === fileName)
      const newFiles = files.filter((file) => file.name !== fileName)

      for (let i = indexToDelete; i < newFiles.length; i++) {
        const match = newFiles[i].name.match(/Solution(\d+)\.java/)
        if (match) {
          const newNumber = parseInt(match[1]) - 1
          newFiles[i].name = `Solution${newNumber}.java`
        }
      }
      setFiles(newFiles)
      if (activeFile === fileName) {
        setActiveFile(newFiles[indexToDelete] ? newFiles[indexToDelete].name : newFiles[newFiles.length - 1].name)
      }
    }
  }

  const handleSolutionChange = (value) => {
    setFiles((prevFiles) => prevFiles.map((file) => (file.name === activeFile ? { ...file, content: value } : file)))
  }

  const handleTestChange = (value) => {
    setTestContent(value)
  }

  const handleRun = async () => {
    if (!isReadyToRun()) {
      toast({
        variant: 'destructive',
        title: 'Empty Code or Test Content',
        description: 'Your code or test content is empty, please check again',       
      })
      return
    }
    setIsRunning(true)
    setTestCaseTab('result')    

    const values = form.getValues()

    const resource = {
      resourceLimits: {
        cpuTimeLimit: values.cpuTimeLimit,
        cpuExtraTime: values.cpuExtraTime,
        memoryLimit: values.memoryLimit * 1024,
        enableNetwork: values.enableNetwork,
        stackLimit: values.stackLimit * 1024,
        maxThread: values.maxThread,
        maxFileSize: values.maxFileSize * 1024
      }
    }

    console.log(resource)

    const testCase = transformTestCases(testCases)
    const createCode = {
      batchCodeExecuteDto: {
        languageCode: 'Java',
        testCases: testCase.testCases,
        solutionCodes: files.map((file) => file.content),
        testCode: testContent
      },
      resourceLimits: resource.resourceLimits
    }

    const testScript = transformTestScript(testCases)
    setValue('testCases', testScript.testCases)

    const testScriptDto = [
      {
        fileName: 'Main.java',
        template: '',
        testCode: testContent,
        description: '',
        languageCode: 'Java',
        solutions: files.map((file) => ({
          fileName: 'Main.java',
          solutionCode: file.content,
          description: '',
          languageCode: 'Java',
          priority: true
        }))
      }
    ]

    setValue('createTestScriptDto', testScriptDto)

    try {
      const response = await runCode(createCode)
      setTestResults(response.codeExecuteDtos)
      const hasCompileOrRuntimeErrors = response.codeExecuteDtos.some(dto =>
        dto.compileErrors || dto.runTimeErrors
      );
  
      if (hasCompileOrRuntimeErrors) {
        toast({
          variant: 'destructive',
          title: 'Runcode Result',
          description: 'There are compile or runtime errors. Please check your code.'
        });
        setIsRunSuccess(false)
        return;
      }

      const hasFailedTestCase = response.codeExecuteDtos.some(dto =>
        dto.testResults.some(testResult => !testResult.isPass)
      );
  
      console.log(response)
      if (hasFailedTestCase) {
        toast({
          variant: 'destructive',
          title: 'Runcode Result',
          description: 'Some test cases failed, please check your code again'
        })
        setIsRunSuccess(false)  
      } else {
        toast({
          variant: 'success',
          title: 'Runcode Result',
          description: 'All test cases passed successfully!'
        })
        setIsRunSuccess(true)       
      }     
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Runcode Result',
        description: 'There was a problem with your request.',
        action: <ToastAction altText='Try again'>Try again</ToastAction>           
      })
      setIsRunSuccess(false)  
      console.error('Error creating course:', error)
    } finally {      
      setIsRunning(false)
    }
  }

  const getDisplayFields = (testCase) => {
    return Object.keys(testCase).filter((key) => key !== 'isHidden')
  }

  const currentSolutionResult = testResults && testResults[selectedSolutionIndex]
  const currentTestCase = currentSolutionResult && currentSolutionResult.testResults[selectedCaseIndex]

  const failedSolutions = testResults
    ? testResults.map((result, index) => (result.status.id !== 3 ? index : -1)).filter((index) => index !== -1)
    : []

  const failedTestCases =
    currentSolutionResult && currentSolutionResult.testResults
      ? currentSolutionResult.testResults
          .map((result, index) => (!result.isPass ? index : -1))
          .filter((index) => index !== -1)
      : []

  return (
    <div className='flex flex-col'>
      <TestCaseGenerator testCases={testCases} setTestCases={setTestCases} />

      <div className='flex justify-center'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-semibold'>Create Code Problem</CardTitle>
        </CardHeader>
      </div>

      <div className='h-[800px] rounded-xl border z-0'>
        <ResizablePanelGroup direction='vertical'>
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction='horizontal'>
              <ResizablePanel defaultSize={50}>
                <div className='flex h-full flex-col'>
                  <div className='flex items-center justify-between px-4 py-2 border-b bg-background shrink-0'>
                    <div className='flex items-center gap-2'>
                      <Code className='w-5 h-5' />
                      <h2 className='text-sm font-medium'>Solution</h2>
                    </div>
                    <div className='flex items-center gap-2'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline' className='w-[200px] justify-between'>
                            {activeFile}
                            <ChevronDown className='ml-2 h-4 w-4 opacity-50' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-[200px]'>
                          {files.map((file) => (
                            <DropdownMenuItem
                              key={file.name}
                              onSelect={() => setActiveFile(file.name)}
                              className='justify-between'
                            >
                              {file.name}
                              {files.length > 1 && (
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  className='h-4 w-4 p-0'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteFile(file.name)
                                  }}
                                >
                                  <X className='h-3 w-3' />
                                </Button>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button type='button' variant='ghost' size='icon' onClick={handleAddFile}>
                        <Plus className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='flex-1 w-full min-h-0'>
                    <Editor
                      height='100%'
                      defaultLanguage='java'
                      theme='vs-dark'
                      value={files.find((file) => file.name === activeFile)?.content || ''}
                      onChange={handleSolutionChange}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        automaticLayout: true,
                        lineNumbers: 'on',
                        lineNumbersMinChars: 3,
                        padding: { top: 10, bottom: 10 }
                      }}
                    />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className='flex h-full flex-col'>
                  <div className='flex items-center justify-between px-4 py-3 border-b bg-background shrink-0'>
                    <div className='flex items-center gap-2'>
                      <TestTube2 className='w-5 h-5' />
                      <h2 className='text-sm font-medium'>Test</h2>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Tabs value='test.java' className='flex-1'>
                        <TabsList className='p-0 bg-transparent h-7'>
                          <TabsTrigger
                            value='test.java'
                            className='relative px-3 text-xs bg-background text-foreground h-7'
                          >
                            Main.java
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  <div className='flex-1 w-full min-h-0'>
                    <Editor
                      height='100%'
                      defaultLanguage='java'
                      theme='vs-dark'
                      value={testContent}
                      onChange={handleTestChange}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        automaticLayout: true,
                        lineNumbers: 'on',
                        lineNumbersMinChars: 3,
                        padding: { top: 10, bottom: 10 }
                      }}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <Card className='flex h-full flex-col rounded-none'>
              <Tabs value={testCaseTab} onValueChange={setTestCaseTab} className='flex h-full flex-col'>
                <div className='flex items-center justify-between border-b px-4 py-2 bg-gray-400'>
                  <TabsList>
                    <TabsTrigger value='testcase'>Testcase</TabsTrigger>
                    <TabsTrigger value='result'>Test Result</TabsTrigger>
                  </TabsList>
                  {isSuccess === false && (
                    <div className='flex items-center gap-2'>
                      <CircleX className='text-red-700 w-8 h-8' />
                      <p className='text-red-700 font-medium'>Failed, please check Test Result</p>
                    </div>
                  )}
                  {isSuccess === true && (
                    <div className='flex items-center gap-2'>
                      <CircleCheck className='text-green-700 w-8 h-8' />
                      <p className='text-green-700 font-medium'>Success, you can move to the next step.</p>
                    </div>
                  )}
                  <Button type='button' onClick={handleRun} disabled={isRunning}>
                    {isRunning ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className='mr-2 h-4 w-4' />
                        Run
                      </>
                    )}
                  </Button>
                </div>
                <ScrollArea className='flex-1'>
                  <TabsContent value='testcase' className='p-4'>
                    <div className='space-y-6'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        {testCases.map((_, index) => (
                          <Button
                            key={index}
                            type='button'
                            variant={selectedCaseIndex === index ? 'default' : 'outline'}
                            className='bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            onClick={() => setSelectedCaseIndex(index)}
                          >
                            Case {index + 1}
                          </Button>
                        ))}
                      </div>
                      {testCases[selectedCaseIndex] && (
                        <div className='space-y-4'>
                          {getDisplayFields(testCases[selectedCaseIndex]).map((field) => (
                            <div key={field}>
                              <div className='text-sm text-muted-foreground mb-2'>{field} =</div>
                              <Input
                                className='font-mono bg-muted'
                                value={testCases[selectedCaseIndex][field]}
                                readOnly
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value='result' className='p-4'>
                    {!testResults ? (
                      <div className='text-center text-lg font-medium text-gray-500'>Please run Code First</div>
                    ) : isRunning ? (
                      <TestResultLoading />
                    ) : (
                      <div className='space-y-6'>
                        <SolutionSelector
                          solutions={testResults}
                          selectedIndex={selectedSolutionIndex}
                          onSelect={setSelectedSolutionIndex}
                          failedSolutions={failedSolutions}
                        />
                        {currentSolutionResult &&
                          currentSolutionResult.testResults &&
                          currentSolutionResult.testResults.length > 0 && (
                            <>
                              <TestCaseSelector
                                testCases={currentSolutionResult.testResults}
                                selectedIndex={selectedCaseIndex}
                                onSelect={setSelectedCaseIndex}
                                failedTestCases={failedTestCases}
                              />
                              {currentTestCase && <TestCaseDisplay result={currentTestCase} />}
                            </>
                          )}
                        <SolutionResult result={currentSolutionResult} />
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default React.memo(CodeEditor)
