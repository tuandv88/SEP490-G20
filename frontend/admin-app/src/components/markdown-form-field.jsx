import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import CustomMarkdownEditor from './custom-markdown-editor'

const MarkdownFormField = ({ name, label, placeholder }) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-base font-semibold' htmlFor={name}>
            {label}
          </FormLabel>
          <FormControl>
            <CustomMarkdownEditor
              value={field.value || ''}
              onChange={(value) => {
                field.onChange(value)
              }}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default MarkdownFormField
