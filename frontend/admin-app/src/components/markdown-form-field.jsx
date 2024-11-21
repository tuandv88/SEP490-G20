import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import CustomMarkdownEditor from './custom-markdown-editor'

const MarkdownFormField = ({ control, name, label, placeholder }) => {
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
