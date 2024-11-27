import React from 'react'

import { Editor } from '@monaco-editor/react'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { FileCode2, Save, TestTube2 } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const Template = ({ setIsSaveTemplate }) => {
  const [testContent, setTestContent] = useState('')
  const { setValue, getValues } = useFormContext();

  const handleTestChange = (value) => {
    setTestContent(value || '')
  }

  const handleSaveAndFinish = () => {
    const currentBatchCodeExecuteDto = getValues('createTestScriptDto');
    currentBatchCodeExecuteDto[0].template = testContent
    setValue('createTestScriptDto', currentBatchCodeExecuteDto)
    setIsSaveTemplate(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Final Step: Set Up Problem Template</CardTitle>
        <CardDescription>
          This is the last step in creating your programming problem. Here, you can set up the initial code template that learners will see when they start the problem. 
          Include any necessary class structures, method signatures, or comments to guide the learners.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col h-[400px] border rounded-md overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-2 border-b bg-background shrink-0'>
            <div className='flex items-center gap-2'>
              <FileCode2 className='w-5 h-5' />
              <h2 className='text-sm font-medium'>Problem Template</h2>
            </div>
            <div className='flex items-center gap-2'>
              <Tabs defaultValue='solution.java' className='flex-1'>
                <TabsList className='h-8 p-0 bg-transparent'>
                  <TabsTrigger value='solution.java' className='px-3 text-xs h-8 data-[state=active]:bg-muted'>
                    Solution.java
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className='flex-1 min-h-0'>
            <Editor
              height="100%"
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
      </CardContent>
      <CardFooter className="flex justify-between">      
        <Button type='button' onClick={handleSaveAndFinish}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}

export default React.memo(Template);
