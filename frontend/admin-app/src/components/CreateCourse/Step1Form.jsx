import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import MarkdownFormField from '@/components/markdown-form-field'
import { Clock, Book, Users, ChevronRight, FileText, Target } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  headline: z.string().min(1, 'Headline is required').max(200, 'Headline must not exceed 200 characters'),
  prerequisites: z.string().min(1, 'Prerequisites are required'),
  description: z.string().min(1, 'Description is required'),
  objectives: z.string().min(1, 'Course objectives are required'),
  targetAudiences: z.string().min(1, 'Target audiences are required'),
  timeEstimation: z
    .number()
    .min(1, 'Estimated time must be greater than 0')
    .max(1000, 'Estimated time must not exceed 1000 hours')
})

export default function Step1Form({ onSubmit, initialData }) {
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
          <Card className='w-full shadow-md'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>Course Details</CardTitle>
              <CardDescription>Provide the essential information about your course</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={methods.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-semibold'>
                        Course Title<span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter course title' className='w-full' />
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
                      <FormLabel className='text-base font-semibold'>
                        Course Headline<span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter course headline' className='w-full' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className='my-6' />

              <MarkdownFormField
                control={methods.control}
                name='description'
                label='Course Description'
                placeholder='Enter course description...'
                icon={<FileText className='w-5 h-5 text-muted-foreground' />}
              />
              <MarkdownFormField
                control={methods.control}
                name='prerequisites'
                label='Prerequisites'
                placeholder='Enter course prerequisites...'
                icon={<Book className='w-5 h-5 text-muted-foreground' />}
              />
              <MarkdownFormField
                control={methods.control}
                name='objectives'
                label='Course Objectives'
                placeholder='Enter course objectives...'
                icon={<Target className='w-5 h-5 text-muted-foreground' />}
              />
              <MarkdownFormField
                control={methods.control}
                name='targetAudiences'
                label='Target Audiences'
                placeholder='Describe the target audiences...'
                icon={<Users className='w-5 h-5 text-muted-foreground' />}
              />

              <Separator className='my-6' />

              <FormField
                control={methods.control}
                name='timeEstimation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base font-semibold'>
                      Estimated Course Duration (hours)<span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='flex items-center'>
                        <Clock className='w-5 h-5 text-muted-foreground mr-2' />
                        <Input
                          type='number'
                          step='0.5'
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder='Enter estimated course duration'
                          className='w-full'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button type='submit' className='w-full sm:w-auto'>
                Next to Step 2
                <ChevronRight className='w-4 h-4 ml-2' />
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  )
}
