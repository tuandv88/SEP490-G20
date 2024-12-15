import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MarkdownFormField from '@/components/markdown-form-field'
import PropTypes from 'prop-types'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  timeEstimation: z
    .number()
    .min(1, 'Time estimation must be at least 1 minute')
    .max(1440, 'Time estimation must not exceed 1440 minutes (24 hours)'),
  lectureType: z.enum(['Lesson', 'Quiz', 'Practice']),
  point: z.number().min(0, 'Points must be non-negative'),
  isFree: z.boolean()
})

export default function LectureForm({ lecture, onSave, onCancel, isLoading, isUpdate }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: lecture || {
      title: '',
      summary: '',
      timeEstimation: 30,
      lectureType: 'Lesson',
      point: 0,
      isFree: false
    }
  })

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSave)} className='space-y-8'>
          <div className='pr-4'>
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
              name='summary'
              label='Summary'
              placeholder='Enter lecture summary...'
            />
            <FormField
              control={methods.control}
              name='timeEstimation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Estimation (minutes)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name='lectureType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecture Type</FormLabel>
                  {isUpdate ? (
                    <div className="p-2 border rounded-md bg-muted">
                      {field.value}
                    </div>
                  ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a lecture type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Lesson'>Lesson</SelectItem>
                        <SelectItem value='Quiz'>Quiz</SelectItem>
                        <SelectItem value='Practice'>Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name='point'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Point</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name='isFree'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between p-4 border rounded-lg'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Free</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='flex justify-end mt-4 space-x-2'>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Lecture'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}

LectureForm.propTypes = {
  lecture: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isUpdate: PropTypes.bool
}
