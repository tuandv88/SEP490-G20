import React from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TestCaseResultPanel({
  activeTab,
  setActiveTab,
  testCases,
  activeTestCase,
  setActiveTestCase,
  testResult
}) {
  return (
    <div className='flex flex-col min-w-0 border-t bg-zinc-900 border-zinc-800'>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='flex flex-col flex-1'>
        <div className='flex items-center px-2 py-1 border-b border-zinc-800'>
          <TabsList className='h-8 p-1 bg-zinc-800'>
            <TabsTrigger
              value='testcase'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 h-6 text-sm'
            >
              <Check className='w-4 h-4 mr-1' />
              Testcase
            </TabsTrigger>
            <TabsTrigger
              value='result'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 h-6 text-sm'
            >
              Test Result
            </TabsTrigger>
          </TabsList>
        </div>

        <div className='flex-1 p-4 overflow-auto'>
          {activeTab === 'testcase' && (
            <div className='space-y-4'>
              <div className='flex gap-2'>
                {testCases.map((testCase) => (
                  <Button
                    key={testCase.id}
                    variant={activeTestCase === testCase.id ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setActiveTestCase(testCase.id)}
                    className='h-7'
                  >
                    {testCase.name}
                  </Button>
                ))}
              </div>
              <div className='space-y-2'>
                {testCases
                  .find((tc) => tc.id === activeTestCase)
                  ?.inputs.map((input, index) => (
                    <div key={index}>
                      <div className='text-sm text-zinc-400'>{input.name} =</div>
                      <div className='p-2 font-mono text-sm rounded bg-zinc-800'>{input.value}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'result' && testResult && (
            <pre className='font-mono text-sm whitespace-pre-wrap'>{testResult}</pre>
          )}
        </div>
      </Tabs>
    </div>
  )
}
