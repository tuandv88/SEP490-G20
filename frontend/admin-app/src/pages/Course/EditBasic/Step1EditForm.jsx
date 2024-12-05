import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import MarkdownFormField from '@/components/markdown-form-field'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  headline: z.string().min(1, 'Headline is required').max(200, 'Headline must not exceed 200 characters'),
  prerequisites: z.string().min(1, 'Prerequisites are required'),
  description: z.string().min(1, 'Description is required'),
  objectives: z.string().min(1, 'Course objectives are required'),
  targetAudiences: z.string().min(1, 'Target audiences are required')
})

export default function Step1EditForm({ onSubmit, initialData }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const handleSubmit = methods.handleSubmit(
    (data) => {
      onSubmit(data)
    },
    (errors) => {}
  )

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <FormField
            control={methods.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter course title' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name='headline'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Headline</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter course headline' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MarkdownFormField
            control={methods.control}
            name='description'
            label='Description'
            placeholder='Enter course description...'
          />
          <MarkdownFormField
            control={methods.control}
            name='prerequisites'
            label='Prerequisites'
            placeholder='Enter course prerequisites...'
          />
          <MarkdownFormField
            control={methods.control}
            name='objectives'
            label='Objectives'
            placeholder='Enter course objectives...'
          />
          <MarkdownFormField
            control={methods.control}
            name='targetAudiences'
            label='Target Audiences'
            placeholder='Describe the target audiences...'
          />

          <Button type='submit'>Next to Step 2</Button>
        </form>
      </Form>
    </FormProvider>
  )
}
