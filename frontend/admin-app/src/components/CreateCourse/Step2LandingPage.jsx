import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MarkdownFormField from '@/components/markdown-form-field'

export default function CourseLandingPage({ onSubmit, initialData }) {
  const methods = useForm({
    defaultValues: initialData
  })

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <FormField
            control={methods.control}
            name='courseStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Course Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Draft'>Draft</SelectItem>
                    <SelectItem value='Published'>Published</SelectItem>
                    <SelectItem value='Scheduled'>Scheduled</SelectItem>
                    <SelectItem value='Archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name='scheduledPublishDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Scheduled Publish Date</FormLabel>
                <FormControl>
                  <Input type='datetime-local' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={methods.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>Course Image</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64Image = reader.result.split(',')[1]; // Remove the prefix
                      const contentType = file.type;
                      const fileName = file.name;
                      field.onChange({
                        fileName,
                        base64Image,
                        contentType
                      });
                    };
                    if (file) {
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={methods.control}
            name='courseLevel'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Course Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
                <FormLabel className='text-base'>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.5'
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Save Course</Button>
        </form>
      </Form>
    </FormProvider>
  )
}
