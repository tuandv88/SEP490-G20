import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, Globe, FileText, X, Trash2, Loader2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { importDocumentFile, importDocumentWeb, importDocumentText } from '@/services/api/documentApi'

export function ImportDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([''])
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('file')
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    console.log('Files selected:', newFiles)
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const addUrlField = () => {
    setUrls([...urls, ''])
  }

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index)
    setUrls(newUrls.length ? newUrls : [''])
  }

  const validateImport = () => {
    switch (activeTab) {
      case 'file':
        if (files.length === 0) {
          toast({
            title: 'Validation Error',
            description: 'Please select at least one file to import.',
            variant: 'destructive'
          })
          return false
        }
        break
      case 'web':
        const validUrls = urls.filter((url) => url.trim() !== '')
        if (validUrls.length === 0) {
          toast({
            title: 'Validation Error',
            description: 'Please enter at least one valid URL.',
            variant: 'destructive'
          })
          return false
        }
        break
      case 'text':
        if (!text.trim()) {
          toast({
            title: 'Validation Error',
            description: 'Please enter some text to import.',
            variant: 'destructive'
          })
          return false
        }
        break
    }
    return true
  }

  const handleImport = async () => {
    console.log('Starting import process')
    if (!validateImport()) {
      console.log('Validation failed')
      return
    }

    setIsLoading(true)
    try {
      let response
      switch (activeTab) {
        case 'text': {
          console.log('Starting text import')
          const payload = { text: text.trim() }
          console.log('Sending payload:', payload)
          response = await importDocumentText(payload)
          console.log('API Response:', response)

          if (response) {
            toast({
              title: 'Import Successful',
              description: 'Text document imported successfully.'
            })
            setIsOpen(false)
            setText('')
          } else {
            throw new Error('No response received from server')
          }
          break
        }
        case 'file': {
          console.log('Starting file import')
          const formData = new FormData()
          files.forEach((file) => {
            formData.append('file', file)
            console.log(`Appending file:`, file.name)
          })
          console.log('Calling importDocumentFile API')
          response = await importDocumentFile(formData)
          console.log('API Response:', response)

          if (response && (response.documentIds || response.success)) {
            const successMessage = response.documentIds
              ? `Successfully imported ${response.documentIds.length} document(s).`
              : 'Import successful.'
            toast({
              title: 'Import Successful',
              description: successMessage
            })
            setIsOpen(false)
            setFiles([])
          } else {
            console.error('Unexpected API response:', response)
            throw new Error('Import failed: Unexpected API response')
          }
          break
        }
        case 'web': {
          console.log('Starting web import')
          const validUrls = urls.filter((url) => url.trim() !== '')
          console.log('Calling importDocumentWeb API with URLs:', validUrls)
          response = await importDocumentWeb({ urls: validUrls })
          console.log('API Response:', response)

          if (response && (response.documentIds || response.success)) {
            const successMessage = response.documentIds
              ? `Successfully imported ${response.documentIds.length} document(s) from URLs.`
              : 'Import successful.'
            toast({
              title: 'Import Successful',
              description: successMessage
            })
            setIsOpen(false)
            setUrls([''])
          } else {
            console.error('Unexpected API response:', response)
            throw new Error('Import failed: Unexpected API response')
          }
          break
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      let errorMessage = error.message || 'An error occurred during import.'

      // Add more specific error messages based on status codes
      if (error.response?.status === 404) {
        errorMessage = 'The import service is not available. Please try again later.'
      } else if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to perform this action. Please log in again.'
      }

      toast({
        title: 'Import Failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <Upload className='mr-2 h-4 w-4' />
          Import Document
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
          <DialogDescription>Choose a method to import your documents.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='file' className='w-full' onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='file'>File</TabsTrigger>
            <TabsTrigger value='web'>Web</TabsTrigger>
            <TabsTrigger value='text'>Text</TabsTrigger>
          </TabsList>
          <TabsContent value='file'>
            <div className='space-y-4'>
              <div className='flex items-center justify-center w-full'>
                <Button onClick={triggerFileInput} variant='outline' className='w-full h-32' disabled={isLoading}>
                  <div className='flex flex-col items-center justify-center'>
                    <Upload className='w-8 h-8 mb-4 text-gray-500' />
                    <p className='mb-2 text-sm text-gray-500'>
                      <span className='font-semibold'>Click to upload</span> or drag and drop
                    </p>
                    <p className='text-xs text-gray-500'>Any file types</p>
                  </div>
                </Button>
                <Input
                  ref={fileInputRef}
                  id='file-upload'
                  type='file'
                  multiple
                  onChange={handleFileChange}
                  className='hidden'
                  accept='*/*'
                  disabled={isLoading}
                />
              </div>
              {files.length > 0 && (
                <ScrollArea className='h-[200px] w-full rounded-md border'>
                  <div className='p-4'>
                    <h4 className='mb-4 text-sm font-medium leading-none'>Selected Files</h4>
                    {files.map((file, index) => (
                      <div key={index} className='flex items-center justify-between py-2'>
                        <div className='flex items-center'>
                          <FileText className='mr-2 h-4 w-4 text-blue-500' />
                          <span className='text-sm'>{file.name}</span>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => removeFile(index)}
                          className='h-8 w-8 p-0'
                          disabled={isLoading}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
          <TabsContent value='web'>
            <div className='space-y-4'>
              <Label className='block text-sm font-medium'>Enter URLs</Label>
              {urls.map((url, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <Input
                    type='url'
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder='https://example.com/document'
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={() => (index === urls.length - 1 ? addUrlField() : removeUrlField(index))}
                    disabled={isLoading}
                  >
                    {index === urls.length - 1 ? <Plus className='h-4 w-4' /> : <X className='h-4 w-4' />}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='text'>
            <div className='space-y-4'>
              <Label htmlFor='text-import' className='block text-sm font-medium'>
                Paste Text
              </Label>
              <Textarea
                id='text-import'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='Paste your text here...'
                className='h-[200px]'
                disabled={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type='submit' onClick={handleImport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Importing...
              </>
            ) : (
              'Import'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
