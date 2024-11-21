'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CircleCheck, CircleX, Play, Loader2, CheckCircle2, XCircle } from 'lucide-react'

const StatusIndicator = ({ isSuccess }) => {
  if (isSuccess === undefined) return null

  return isSuccess ? (
    <div className='flex items-center gap-2'>
      <CircleCheck className='text-green-700 w-8 h-8' />
      <p className='text-green-700 font-medium'>Success, you can move to the next step.</p>
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      <CircleX className='text-red-700 w-8 h-8' />
      <p className='text-red-700 font-medium'>Failed, please check Test Result</p>
    </div>
  )
}

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

const TestCaseDisplay = ({ testCase, result }) => (
  <div className='space-y-4'>
    <div>
      <div className='text-sm text-muted-foreground mb-2'>Inputs:</div>
      {Object.entries(testCase.inputs).map(([key, value]) => (
        <div key={key} className='mb-2'>
          <div className='text-sm text-muted-foreground'>{key} =</div>
          <Input
            className='font-mono bg-muted'
            value={value}
            readOnly
          />
        </div>
      ))}
    </div>
    <div>
      <div className='text-sm text-muted-foreground mb-2'>Expected Output =</div>
      <Input
        className='font-mono bg-muted'
        value={testCase.expectedOutput}
        readOnly
      />
    </div>
    {result && (
      <>
        <div>
          <div className='text-sm text-muted-foreground mb-2'>Actual Output =</div>
          <Input
            className='font-mono bg-muted'
            value={result.output}
            readOnly
          />
        </div>
        <div className={`flex items-center gap-2 ${result.isPass ? 'text-green-600' : 'text-red-600'}`}>
          {result.isPass ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
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
      <span className={result.status.id === 3 ? 'text-green-600' : 'text-red-600'}>
        {result.status.description}
      </span>
    </div>
    <div>
      <div className='text-sm font-medium'>Language: </div>
      <span>{result.languageCode}</span>
    </div>
    <div>
      <div className='text-sm font-medium'>Execution Time: </div>
      <span>{result.executionTime} ms</span>
    </div>
    <div>
      <div className='text-sm font-medium'>Memory Usage: </div>
      <span>{result.memoryUsage} bytes</span>
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

// Sample test cases for the testcase tab
const sampleTestCases = [
  {
    inputs: {
      x1: "1",
      x2: "2"
    },
    expectedOutput: "N/A"
  },
  {
    inputs: {
      x1: "3",
      x2: "4"
    },
    expectedOutput: "N/A"
  }
]

// Simulated response data for the result tab
const simulatedResponse = {
  "codeExecuteDtos": [
    {
      "runTimeErrors": null,
      "compileErrors": null,
      "executionTime": 0.261,
      "memoryUsage": 13452,
      "testResults": [
        {
          "inputs": {
            "l1": "2 4 3",
            "l2": "5 6 4"
          },
          "output": "[7, 0, 8]",
          "stdout": "N/A",
          "expected": "[7, 0, 8]",
          "isPass": true
        },
        {
          "inputs": {
            "l1": "0",
            "l2": "0"
          },
          "output": "[0]",
          "stdout": "N/A",
          "expected": "[0]",
          "isPass": false
        },
        {
          "inputs": {
            "l1": "9 9 9 9",
            "l2": "9 9 9"
          },
          "output": "[8, 9, 9, 0, 1]",
          "stdout": "N/A",
          "expected": "[8, 9, 9, 0, 1]",
          "isPass": true
        }
      ],
      "status": {
        "id": 3,
        "description": "Accepted"
      },
      "languageCode": "Java"
    },
    {
      "runTimeErrors": null,
      "compileErrors": "Main.java:98: error: class, interface, or enum expected\nimpor java.math.BigInteger;\n^\n1 error\n",
      "executionTime": 0,
      "memoryUsage": 0,
      "testResults": [],
      "status": {
        "id": 6,
        "description": "Compilation Error"
      },
      "languageCode": "Java"
    }
  ]
}

export default function TestPanel({ testCasesInput }) {
  const [testCaseTab, setTestCaseTab] = useState('testcase')
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0)
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0)
  const [isSuccess, setIsSuccess] = useState(undefined)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)


  const handleRun = () => {
    setIsRunning(true)
    setTestCaseTab('result')
    // Simulate API call
    setTimeout(() => {
      setTestResults(simulatedResponse.codeExecuteDtos)
      setIsSuccess(simulatedResponse.codeExecuteDtos.every(result => result.status.id === 3))
      setIsRunning(false)
    }, 2000)
  }

  const currentSolutionResult = testResults && testResults[selectedSolutionIndex]
  const currentTestCase = currentSolutionResult && currentSolutionResult.testResults[selectedCaseIndex]

  const failedSolutions = testResults
    ? testResults.map((result, index) => result.status.id !== 3 ? index : -1).filter(index => index !== -1)
    : []

  const failedTestCases = currentSolutionResult && currentSolutionResult.testResults
    ? currentSolutionResult.testResults.map((result, index) => !result.isPass ? index : -1).filter(index => index !== -1)
    : []

  return (
    <Card className='flex h-full flex-col rounded-none'>
      <Tabs value={testCaseTab} onValueChange={setTestCaseTab} className='flex h-full flex-col'>
        <div className='flex items-center justify-between border-b px-4 py-2 bg-gray-400'>
          <TabsList>
            <TabsTrigger value='testcase'>Testcase</TabsTrigger>
            <TabsTrigger value='result'>Test Result</TabsTrigger>
          </TabsList>
          <StatusIndicator isSuccess={isSuccess} />
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
            {testCasesInput && (
                <div className='space-y-6'>
                <TestCaseSelector 
                  testCases={testCasesInput} 
                  selectedIndex={selectedCaseIndex} 
                  onSelect={setSelectedCaseIndex} 
                />
                {testCasesInput[selectedCaseIndex] && (
                  <TestCaseDisplay testCase={testCasesInput[selectedCaseIndex]} />
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value='result' className='p-4'>
            {!testResults ? (
              <div className='text-center text-lg font-medium text-gray-500'>Please run Code First</div>
            ) : (
              <div className='space-y-6'>
                <SolutionSelector
                  solutions={testResults}
                  selectedIndex={selectedSolutionIndex}
                  onSelect={setSelectedSolutionIndex}
                  failedSolutions={failedSolutions}
                />
                {currentSolutionResult && currentSolutionResult.testResults && currentSolutionResult.testResults.length > 0 && (
                  <>
                    <TestCaseSelector 
                      testCases={currentSolutionResult.testResults} 
                      selectedIndex={selectedCaseIndex} 
                      onSelect={setSelectedCaseIndex}
                      failedTestCases={failedTestCases}
                    />
                    {currentTestCase && (
                      <TestCaseDisplay testCase={currentTestCase} result={currentTestCase} />
                    )}
                  </>
                )}
                <SolutionResult result={currentSolutionResult} />
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  )
}