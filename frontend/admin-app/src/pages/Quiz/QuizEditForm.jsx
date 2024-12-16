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
import { Card, CardContent } from '@/components/ui/card'
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

function QuizEditForm({ isOpen, onOpenChange, onSubmit, defaultValues }) {
  const methods = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      passingMark: defaultValues.passingMark,
      hasTimeLimit: defaultValues.hasTimeLimit,
      timeLimit: defaultValues.timeLimit || 1,
      hasAttemptLimit: defaultValues.hasAttemptLimit,
      attemptLimit: defaultValues.attemptLimit || 1,
      isActive: defaultValues.isActive,
      isRandomized: defaultValues.isRandomized,
      quizType: defaultValues.quizType
    }
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = methods

  const hasTimeLimit = watch('hasTimeLimit')
  const hasAttemptLimit = watch('hasAttemptLimit')
  const { toast } = useToast()

  const handleFormSubmit = async (data) => {
    try {
      const quizData = {
        quiz: {
          isActive: data.isActive,
          isRandomized: data.isRandomized,
          title: data.title,
          description: data.description,
          passingMark: data.passingMark,
          timeLimit: data.hasTimeLimit ? data.timeLimit : 1,
          hasTimeLimit: data.hasTimeLimit,
          attemptLimit: data.hasAttemptLimit ? data.attemptLimit : 1,
          hasAttemptLimit: data.hasAttemptLimit,
          quizType: data.quizType
        }
      }

      await onSubmit(quizData)
      onOpenChange(false)
      toast({
        title: 'Quiz Updated',
        description: 'Your quiz has been successfully updated.',
        variant: 'default',
        duration: 1500
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update quiz. Please try again.',
        variant: 'destructive',
        duration: 1500
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Edit Quiz</DialogTitle>
          <DialogDescription>Update the quiz details.</DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='space-y-6 py-4 overflow-y-auto pr-6' style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <Card>
                <CardContent className='pt-6'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='title' className='text-sm font-medium'>
                        Title
                      </Label>
                      <Controller
                        name='title'
                        control={control}
                        render={({ field }) => <Input {...field} id='title' className='w-full' />}
                      />
                      {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='passingMark' className='text-sm font-medium'>
                        Passing Mark
                      </Label>
                      <Controller
                        name='passingMark'
                        control={control}
                        render={({ field }) => <Input {...field} id='passingMark' type='number' className='w-full' />}
                      />
                      {errors.passingMark && <p className='text-sm text-red-500'>{errors.passingMark.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='description' className='text-sm font-medium'>
                      Description
                    </Label>
                    <MarkdownFormField
                      control={control}
                      name='description'
                      label=''
                      placeholder='Enter quiz description'
                    />
                    {errors.description && <p className='text-sm text-red-500'>{errors.description.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='hasTimeLimit' className='text-sm font-medium'>
                          Has Time Limit
                        </Label>
                        <Controller
                          name='hasTimeLimit'
                          control={control}
                          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                        />
                      </div>
                      {hasTimeLimit && (
                        <div className='space-y-2'>
                          <Label htmlFor='timeLimit' className='text-sm font-medium'>
                            Time Limit (minutes)
                          </Label>
                          <Controller
                            name='timeLimit'
                            control={control}
                            render={({ field }) => <Input {...field} id='timeLimit' type='number' className='w-full' />}
                          />
                          {errors.timeLimit && <p className='text-sm text-red-500'>{errors.timeLimit.message}</p>}
                        </div>
                      )}
                    </div>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='hasAttemptLimit' className='text-sm font-medium'>
                          Has Attempt Limit
                        </Label>
                        <Controller
                          name='hasAttemptLimit'
                          control={control}
                          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                        />
                      </div>
                      {hasAttemptLimit && (
                        <div className='space-y-2'>
                          <Label htmlFor='attemptLimit' className='text-sm font-medium'>
                            Attempt Limit
                          </Label>
                          <Controller
                            name='attemptLimit'
                            control={control}
                            render={({ field }) => (
                              <Input {...field} id='attemptLimit' type='number' className='w-full' />
                            )}
                          />
                          {errors.attemptLimit && <p className='text-sm text-red-500'>{errors.attemptLimit.message}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='isActive' className='text-sm font-medium'>
                        Is Active
                      </Label>
                      <Controller
                        name='isActive'
                        control={control}
                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='isRandomized' className='text-sm font-medium'>
                        Is Randomized
                      </Label>
                      <Controller
                        name='isRandomized'
                        control={control}
                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='quizType' className='text-sm font-medium'>
                      Quiz Type
                    </Label>
                    <Controller
                      name='quizType'
                      control={control}
                      render={({ field }) => <Input {...field} readOnly value={field.value} className='bg-muted' />}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className='mt-6'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Quiz'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export { QuizEditForm }
