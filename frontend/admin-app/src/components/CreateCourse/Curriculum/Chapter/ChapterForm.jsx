import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import MarkdownFormField from '@/components/markdown-form-field'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title must not exceed 50 characters'),
  description: z.string().min(1, 'Description is required'),

  isActive: z.boolean()
})

export default function ChapterForm({ chapter, onSave, onCancel }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: chapter || {
      title: '',
      description: '',
      isActive: true
    }
  })

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        description: chapter.description,
        timeEstimation: chapter.timeEstimation,
        isActive: chapter.isActive
      })
    }
  }, [chapter, methods])

  const handleSubmit = methods.handleSubmit((data) => {
    onSave(chapter ? { ...chapter, ...data } : data)
  })

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='px-6 py-4'>
            <FormField
              control={methods.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MarkdownFormField
              control={methods.control}
              name='description'
              label='Description'
              placeholder='Enter chapter description...'
            />

            <FormField
              control={methods.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between p-4 border rounded-lg'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='flex justify-end mt-4 space-x-2'>
            <Button type='button' variant='outline' onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button type='submit'>Save Chapter</Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}
