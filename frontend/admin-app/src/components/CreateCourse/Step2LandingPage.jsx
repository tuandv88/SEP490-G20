import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Image, BarChart, DollarSign, Upload, ChevronRight } from 'lucide-react'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const landingPageSchema = z.object({
  image: z.object(
    {
      fileName: z.string(),
      base64Image: z.string(),
      contentType: z.string().refine((value) => ACCEPTED_IMAGE_TYPES.includes(value), {
        message: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
      })
    },
    {
      required_error: 'Course image is required'
    }
  ),
  courseLevel: z.enum(['Basic', 'Intermediate', 'Advanced', 'Expert'], {
    required_error: 'Please select a course level'
  }),
  price: z
    .number()
    .min(0, 'Price must be 0 or greater')
    .max(1000, 'Price must not exceed 1000 USD')
    .or(
      z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/)
        .transform(Number)
    )
    .refine((n) => n >= 0 && n <= 1000, {
      message: 'Price must be between 0 and 1000 USD'
    })
})

export default function CourseLandingPage({ onSubmit, onChange, initialData }) {
  const [previewImage, setPreviewImage] = useState(null)
  const methods = useForm({
    resolver: zodResolver(landingPageSchema),
    defaultValues: initialData
  })

  useEffect(() => {
    // Update form values when initialData changes
    methods.reset(initialData)
    if (initialData.image && initialData.image.base64Image) {
      setPreviewImage(initialData.image.base64Image)
    }
  }, [initialData, methods])

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data)
  })

  const handleChange = (name, value) => {
    onChange({ [name]: value })
    methods.setValue(name, value)
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <Card className='w-full shadow-md'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold'>Course Landing Page</CardTitle>
              <CardDescription>Set up your course's public information to attract students</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={methods.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base font-semibold flex items-center gap-1'>
                      Course Image <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='flex flex-col items-center space-y-4'>
                        {previewImage ? (
                          <div className='group relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200'>
                            <img src={previewImage} alt='Course preview' className='w-full h-full object-cover' />
                            <div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                              <Button
                                type='button'
                                variant='secondary'
                                size='sm'
                                onClick={() => {
                                  setPreviewImage(null)
                                  field.onChange(null)
                                  handleChange('image', null)
                                }}
                                className='text-white hover:text-red-400'
                              >
                                Remove Image
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className='w-full'>
                            <label
                              htmlFor='dropzone-file'
                              className='relative flex flex-col items-
center justify-center w-full h-[280px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200'
                            >
                              <div className='flex flex-col items-center justify-center pt-5 pb-6 px-4'>
                                <div className='mb-3 p-4 rounded-full bg-gray-100'>
                                  <Upload className='w-8 h-8 text-gray-500' />
                                </div>
                                <p className='mb-2 text-sm text-gray-500'>
                                  <span className='font-medium'>Click to upload</span>
                                </p>
                                <p className='text-xs text-gray-500 text-center'>
                                  PNG, JPG or WebP
                                  <br />
                                  (Recommended: 1280x720px)
                                </p>
                                <p className='mt-2 text-xs text-gray-500'>Max file size: 5MB</p>
                              </div>
                              <Input
                                id='dropzone-file'
                                type='file'
                                accept='image/png,image/jpeg,image/webp'
                                className='hidden'
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    if (file.size > MAX_FILE_SIZE) {
                                      methods.setError('image', {
                                        type: 'manual',
                                        message: 'Image size should not exceed 5MB'
                                      })
                                      return
                                    }
                                    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                                      methods.setError('image', {
                                        type: 'manual',
                                        message: 'Please upload a valid image file (PNG, JPG, or WebP)'
                                      })
                                      return
                                    }
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                      const base64Image = reader.result
                                      setPreviewImage(base64Image)
                                      const imageData = {
                                        fileName: file.name,
                                        base64Image,
                                        contentType: file.type
                                      }
                                      field.onChange(imageData)
                                      handleChange('image', imageData)
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className='mt-2' />
                  </FormItem>
                )}
              />

              <Separator className='my-6' />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={methods.control}
                  name='courseLevel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-semibold'>
                        Course Level <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          handleChange('courseLevel', value)
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <BarChart className='w-4 h-4 mr-2' />
                            <SelectValue placeholder='Select a level' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Basic'>Basic</SelectItem>
                          <SelectItem value='Intermediate'>Intermediate</SelectItem>
                          <SelectItem value='Advanced'>Advanced</SelectItem>
                          <SelectItem value='Expert'>Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-semibold'>
                        Price (USD) <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className='flex items-center'>
                          <DollarSign className='w-5 h-5 text-muted-foreground mr-2' />
                          <Input
                            type='number'
                            step='0.01'
                            min='0'
                            max='1000'
                            {...field}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value)
                              field.onChange(value)
                              handleChange('price', value)
                            }}
                            placeholder='Enter course price'
                            className='w-full'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button type='submit' className='w-full sm:w-auto'>
                Save Course
                <ChevronRight className='w-4 h-4 ml-2' />
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  )
}
