import React, { useState, useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BarChart, DollarSign, Upload, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { updateCourseImage } from '@/services/api/courseApi'

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const landingPageSchema = z.object({
  courseLevel: z.string(),
  image: z
    .object({
      fileName: z.string(),
      base64Image: z.string(),
      contentType: z.string().refine((value) => ACCEPTED_IMAGE_TYPES.includes(value), {
        message: 'Only .jpg, .jpeg, .png and .webp formats are supported.'
      })
    })
    .optional(),
  price: z.number().min(0, 'Price must be 0 or greater').max(1000, 'Price must not exceed 1000 USD')
})

export default function Step2EditLandingPage({ onSubmit, onChange, initialData }) {
  const [previewImage, setPreviewImage] = useState(initialData.imageUrl || null)
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  const methods = useForm({
    resolver: zodResolver(landingPageSchema),
    defaultValues: {
      ...initialData,
      image: initialData.imageUrl
        ? {
            fileName: 'current-image.jpg',
            base64Image: initialData.imageUrl,
            contentType: 'image/jpeg'
          }
        : null
    }
  })

  useEffect(() => {
    methods.reset({
      ...initialData,
      image: initialData.imageUrl
        ? {
            fileName: 'current-image.jpg',
            base64Image: initialData.imageUrl,
            contentType: 'image/jpeg'
          }
        : null
    })
    setPreviewImage(initialData.imageUrl || null)
  }, [initialData, methods])

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data)
    onChange(data)
  })

  const handleImageUpdate = async (file) => {
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

      setIsUpdatingImage(true)

      // Store the current image URL as fallback
      const currentImageUrl = previewImage

      try {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64Image = reader.result.split(',')[1] // Remove the data:image/xxx;base64, part
          const imageData = {
            courseId: initialData.id,
            imageDto: {
              fileName: file.name,
              base64Image: base64Image,
              contentType: file.type
            }
          }

          const response = await updateCourseImage(initialData.id, imageData)

          if (response && response.presignedUrl) {
            setPreviewImage(response.presignedUrl)
            methods.setValue('image', {
              fileName: file.name,
              base64Image: response.presignedUrl,
              contentType: file.type
            })
            onChange({ imageUrl: response.presignedUrl })
            toast({
              title: 'Image Updated',
              description: 'Course image has been successfully updated.',
              variant: 'default'
            })
          } else {
            throw new Error('Invalid response from server')
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        // Revert to the previous image URL
        setPreviewImage(currentImageUrl)
        toast({
          title: 'Error',
          description: 'Failed to update course image. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setIsUpdatingImage(false)
      }
    }
  }

  const handleUpdateImageClick = () => {
    fileInputRef.current.click()
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <Card>
            <CardContent className='pt-6'>
              <div className='grid gap-6'>
                <Separator className='my-6' />
                <FormField
                  control={methods.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-semibold'>Course Image</FormLabel>
                      <FormControl>
                        <div className='flex flex-col items-center space-y-4'>
                          {previewImage ? (
                            <div className='group relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200'>
                              <img
                                src={previewImage}
                                alt='Course preview'
                                className='w-full h-full object-cover'
                                onError={(e) => {
                                  setPreviewImage(null)
                                  toast({
                                    title: 'Error',
                                    description: 'Failed to load the image. Please try uploading again.',
                                    variant: 'destructive'
                                  })
                                }}
                              />
                              <div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                <Button
                                  type='button'
                                  variant='secondary'
                                  size='sm'
                                  onClick={handleUpdateImageClick}
                                  disabled={isUpdatingImage}
                                  className='text-white hover:text-blue-400'
                                >
                                  {isUpdatingImage ? 'Updating...' : 'Update Image'}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='w-full'>
                              <label
                                htmlFor='dropzone-file'
                                className='relative flex flex-col items-center justify-center w-full h-[280px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200'
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
                                  onChange={(e) => handleImageUpdate(e.target.files?.[0])}
                                  disabled={isUpdatingImage}
                                />
                              </label>
                            </div>
                          )}
                          <Input
                            ref={fileInputRef}
                            type='file'
                            accept='image/png,image/jpeg,image/webp'
                            className='hidden'
                            onChange={(e) => handleImageUpdate(e.target.files?.[0])}
                            disabled={isUpdatingImage}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className='my-6' />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={methods.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-base font-semibold'>Price (USD)</FormLabel>
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
                                onChange({ price: value })
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
              </div>
            </CardContent>
          </Card>
          <div className='flex justify-end'>
            <Button type='submit' className='w-full sm:w-auto'>
              Update Landing Page
              <ChevronRight className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}
