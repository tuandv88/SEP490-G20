import React from 'react'
import { Editor } from '@monaco-editor/react'
import { TestTube2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TestPanel({ testCode, setTestCode }) {
  return (
    <div className='flex flex-col w-full min-w-0'>
      <div className='flex items-center px-4 py-2 border-b bg-background shrink-0'>
        <div className='flex items-center gap-2'>
          <TestTube2 className='w-5 h-5' />
          <h2 className='text-sm font-medium'>Test</h2>
        </div>
      </div>
      <div className='flex items-center px-4 py-2 bg-muted'>
        <Tabs value='test.java' className='flex-1'>
          <TabsList className='p-0 bg-transparent h-7'>
            <TabsTrigger value='test.java' className='relative px-3 text-xs bg-background text-foreground h-7'>
              test.java
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className='flex-1 w-full min-h-0'>
        <Editor
          className='w-full h-full'
          defaultLanguage='java'
          value={testCode}
          onChange={(value) => setTestCode(value || '')}
          theme='vs-dark'
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            padding: { top: 10, bottom: 10 }
          }}
        />
      </div>
    </div>
  )
}
