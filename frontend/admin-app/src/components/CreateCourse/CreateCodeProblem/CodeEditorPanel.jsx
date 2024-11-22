import React from 'react'
import { Button } from '@/components/ui/button'
import { Editor } from '@monaco-editor/react'
import { MoreVertical, Plus, Code } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function CodeEditorPanel({
  title,
  files,
  activeFile,
  setActiveFile,
  setIsNewFileDialogOpen,
  setFileToManage,
  setIsRenameDialogOpen,
  setIsDeleteDialogOpen,
  handleSolutionCodeChange,
  handleAddFile
}) {
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex items-center px-4 py-2 border-b bg-background shrink-0'>
        <div className='flex items-center gap-2'>
          <Code className='w-5 h-5' />
          <h2 className='text-sm font-medium'>{title}</h2>
        </div>
      </div>
      <div className='flex items-center px-4 py-2 bg-muted'>
        <Tabs value={activeFile} onValueChange={setActiveFile} className='flex-1'>
          <TabsList className='p-0 bg-transparent h-7'>
            {files.map((file) => (
              <TabsTrigger
                key={file.name}
                value={file.name}
                className='relative data-[state=active]:bg-background data-[state=active]:text-foreground px-3 h-7 text-xs'
              >
                {file.name}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>                   
                      <MoreVertical className='w-4 h-4 ml-2' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setFileToManage(file)
                        setIsRenameDialogOpen(true)
                      }}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setFileToManage(file)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button variant='ghost' size='icon' className='ml-2 h-7 w-7' onClick={() => setIsNewFileDialogOpen(true)}>
          <Plus className='w-4 h-4' />
        </Button>
      </div>
      <div className='flex-1 w-full min-h-0'>
        <Editor
          className='w-full h-full'
          defaultLanguage='java'
          value={files.find((file) => file.name === activeFile)?.content || ''}
          onChange={handleSolutionCodeChange}
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
