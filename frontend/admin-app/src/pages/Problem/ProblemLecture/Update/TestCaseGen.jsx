'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

const TestCaseGen = ({ testCases, setTestCases }) => {
  const [params, setParams] = useState([])
  const [newParam, setNewParam] = useState('')
  const [previewInput, setPreviewInput] = useState('')
  const [previewOutput, setPreviewOutput] = useState('')

  console.log(testCases)

  useEffect(() => {
    if (testCases && testCases.length > 0) {
      const extractedParams = Object.keys(testCases[0]).filter(key => key !== 'expectedOutput' && key !== 'isHidden' && key !== 'id');
      setParams(extractedParams);
    }
  }, [testCases]);

  const addParam = () => {
    if (newParam && !params.includes(newParam)) {
      setParams([...params, newParam])
      setNewParam('')
    }
  }

  const removeParam = (param) => {
    setParams(params.filter((p) => p !== param))
    setTestCases(
      testCases.map((testCase) => {
        const { [param]: removed, ...rest } = testCase
        return rest
      })
    )
  }

  const createTestCase = () => {
    const newTestCase = params.reduce((acc, param) => {
      acc[param] = ''
      return acc
    }, {})
    setTestCases([...testCases, { ...newTestCase, expectedOutput: 'N/A', isHidden: false  }])
  }

  const updateTestCaseValue = (testCaseIndex, param, value) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[testCaseIndex][param] = value
    setTestCases(updatedTestCases)
  }

  const updateExpectedOutput = (testCaseIndex, value) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[testCaseIndex].expectedOutput = value
    setTestCases(updatedTestCases)
  }

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const toggleTestCaseHidden = (index) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index].isHidden = !updatedTestCases[index].isHidden
    setTestCases(updatedTestCases)
  }

  useEffect(() => {
    // Update Preview Input
    const input = testCases.flatMap((testCase) => params.map((param) => `${testCase[param]}`)).join('\n')
    setPreviewInput(input)

    // Update Preview Output
    const output = JSON.stringify(
      testCases.map((testCase) => ({
        Output: testCase.expectedOutput,
        Stdout: ''
      })),
      null,
      2
    )
    setPreviewOutput(output)
  }, [testCases, params])

  const createTestCaseNoParam = () => {
    setTestCases([...testCases, { expectedOutput: '', isHidden: false }])
  }

  return (
    <Card className='w-full mx-auto'>
      <div className='flex justify-center'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-semibold'>Test Case Generator</CardTitle>
        </CardHeader>
      </div>
      <CardFooter className='flex flex-col items-stretch gap-4'>
        <div className='grid grid-cols-3 gap-4'>
          <div className={`col-span-2 grid  ${testCases.length === 0 ? 'rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center' : 'grid-cols-2 gap-4'}`}>
            {testCases.length === 0 && <p className='text-center text-gray-500 w-full font-semibold'>No test cases created yet.</p>}
            {testCases.map((testCase, testCaseIndex) => {
              const { id, ...displayTestCase } = testCase; // Loại bỏ 'id' khi hiển thị
              return (
                <Card key={id || testCaseIndex} className='w-full mb-4'>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-semibold'>Test Case {testCaseIndex + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`hidden-toggle-${testCaseIndex}`}>Hidden</Label>
                        <Switch
                          id={`hidden-toggle-${testCaseIndex}`}
                          checked={testCase.isHidden}
                          onCheckedChange={() => toggleTestCaseHidden(testCaseIndex)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestCase(testCaseIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(displayTestCase).map(([param, value]) => (
                      param !== 'expectedOutput' && param !== 'isHidden' && (
                        <div key={param} className="flex items-center gap-2 mb-2">
                          <Label htmlFor={`${testCaseIndex}-${param}`} className="w-1/3">
                            <Badge variant="outline" className="mr-2">{param}</Badge>
                          </Label>
                          <Input
                            id={`${testCaseIndex}-${param}`}
                            value={value}
                            onChange={(e) => updateTestCaseValue(testCaseIndex, param, e.target.value)}
                            className="w-2/3"
                          />
                        </div>
                      )
                    ))}
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor={`${testCaseIndex}-expectedOutput`} className="w-1/3">
                        <Badge variant="outline" className="mr-2">Expected Output</Badge>
                      </Label>
                      <Input
                        id={`${testCaseIndex}-expectedOutput`}
                        value={testCase.expectedOutput}
                        onChange={(e) => updateExpectedOutput(testCaseIndex, e.target.value)}
                        className="w-2/3"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div>
            <Card className='w-full mb-4'>
              <CardContent className='space-y-4'>
                <div className='flex gap-2 mt-4'>
                  <Input
                    placeholder='Enter parameter name'
                    value={newParam}
                    onChange={(e) => setNewParam(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addParam(); 
                      }
                    }}
                  />
                  <Button type='button' onClick={addParam} className='flex-shrink-0'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Param
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {params.map((param) => (
                    <div key={param} className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                      <span>{param}</span>
                      <Button variant='ghost' size='sm' className='ml-2 p-0 h-auto' onClick={() => removeParam(param)}>
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type='button' onClick={createTestCase} disabled={params.length === 0} className='w-fit'>
                  Create Test Case
                </Button>
                <Button type='button' onClick={createTestCaseNoParam} className='w-fit ml-2'>
                  Create No Parameters
                </Button>
              </CardFooter>
            </Card>
            <Card className='w-full mb-4'>
              <CardHeader>
                <CardTitle>Preview Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={previewInput} readOnly className='w-full h-40' />
              </CardContent>
            </Card>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Preview Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={previewOutput} readOnly className='w-full h-40' />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default React.memo(TestCaseGen)
