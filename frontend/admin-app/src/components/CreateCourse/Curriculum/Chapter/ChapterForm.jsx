import React from 'react'
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
  timeEstimation: z
    .number()
    .min(0.1, 'Time estimation must be greater than 0')
    .max(1000, 'Time estimation must not exceed 1000 hours'),
  isActive: z.boolean()
})

export default function ChapterForm({ chapter, onSave, onCancel }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: chapter || {
      title: '',
      description: '',
      timeEstimation: 1,
      isActive: true
    }
  })

  const handleSubmit = methods.handleSubmit((data) => {
    onSave(data)
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
              name='timeEstimation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Estimation (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
