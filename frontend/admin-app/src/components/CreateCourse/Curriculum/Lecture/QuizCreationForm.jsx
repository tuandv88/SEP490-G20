'use client'

import React from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import MarkdownFormField from '@/components/markdown-form-field'

// Define the schema for form validation
const quizSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    passingMark: z.coerce
      .number()
      .int('Passing mark must be an integer')
      .min(1, 'Passing mark must be a non-negative integer'),
    hasTimeLimit: z.boolean(),
    timeLimit: z.coerce.number().int('Time limit must be an integer').optional(),
    hasAttemptLimit: z.boolean(),
    attemptLimit: z.coerce.number().int('Attempt limit must be an integer').optional(),
    isActive: z.boolean(),
    isRandomized: z.boolean(),
    quizType: z.enum(['PRACTICE', 'FINAL'])
  })
  .superRefine((data, ctx) => {
    if (data.hasTimeLimit) {
      if (data.timeLimit === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time limit is required when 'Has Time Limit' is enabled",
          path: ['timeLimit']
        })
      } else if (data.timeLimit < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Time limit must be at least 1 minute when enabled',
          path: ['timeLimit']
        })
      }
    }

    if (data.hasAttemptLimit) {
      if (data.attemptLimit === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Attempt limit is required when 'Has Attempt Limit' is enabled",
          path: ['attemptLimit']
        })
      } else if (data.attemptLimit < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Attempt limit must be at least 1 when enabled',
          path: ['attemptLimit']
        })
      }
    }
  })

export default function QuizCreationForm({ isOpen, onOpenChange, onSubmit }) {
  const methods = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      passingMark: 0,
      hasTimeLimit: false,
      timeLimit: 1,
      hasAttemptLimit: false,
      attemptLimit: 1,
      isActive: true,
      isRandomized: false,
      quizType: 'PRACTICE'
    }
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = methods

  const hasTimeLimit = watch('hasTimeLimit')
  const hasAttemptLimit = watch('hasAttemptLimit')
  const { toast } = useToast()
  const handleFormSubmit = (data) => {
    onSubmit(data)
    onOpenChange(false)
    toast({
      title: 'Quiz Created',
      description: 'Your quiz has been successfully created.'
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='grid gap-6 py-4'>
              <div className='grid grid-cols-2 gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Controller name='title' control={control} render={({ field }) => <Input {...field} id='title' />} />
                  {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='passingMark'>Passing Mark</Label>
                  <Controller
                    name='passingMark'
                    control={control}
                    render={({ field }) => <Input {...field} id='passingMark' type='number' />}
                  />
                  {errors.passingMark && <p className='text-sm text-red-500'>{errors.passingMark.message}</p>}
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='description'>Description</Label>
                <MarkdownFormField control={control} name='description' label='' placeholder='Enter quiz description' />
                {errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='hasTimeLimit'>Has Time Limit</Label>
                    <Controller
                      name='hasTimeLimit'
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  </div>

                  {hasTimeLimit && (
                    <div className='grid gap-2'>
                      <Label htmlFor='timeLimit'>Time Limit (minutes)</Label>
                      <Controller
                        name='timeLimit'
                        control={control}
                        render={({ field }) => <Input {...field} id='timeLimit' type='number' />}
                      />
                      {errors.timeLimit && <p className='text-sm text-red-500'>{errors.timeLimit.message}</p>}
                    </div>
                  )}
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='hasAttemptLimit'>Has Attempt Limit</Label>
                    <Controller
                      name='hasAttemptLimit'
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  </div>

                  {hasAttemptLimit && (
                    <div className='grid gap-2'>
                      <Label htmlFor='attemptLimit'>Attempt Limit</Label>
                      <Controller
                        name='attemptLimit'
                        control={control}
                        render={({ field }) => <Input {...field} id='attemptLimit' type='number' />}
                      />
                      {errors.attemptLimit && <p className='text-sm text-red-500'>{errors.attemptLimit.message}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='isActive'>Is Active</Label>
                  <Controller
                    name='isActive'
                    control={control}
                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='isRandomized'>Is Randomized</Label>
                  <Controller
                    name='isRandomized'
                    control={control}
                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                  />
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='quizType'>Quiz Type</Label>
                <Controller
                  name='quizType'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select quiz type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='PRACTICE'>Practice</SelectItem>
                        <SelectItem value='FINAL'>Final</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='mt-6'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit'>Create Quiz</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
