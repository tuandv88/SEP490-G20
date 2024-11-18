import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MarkdownFormField from '@/components/markdown-form-field'
import VariablesManager from './variables-manager'

export default function BasicInfoStep({ form, variables, setVariables }) {
  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='mb-6 text-3xl font-bold'>Create Code Problem - Basic Info</h1>
      <FormField
        control={form.control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder='Enter problem title' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <MarkdownFormField
        control={form.control}
        name='description'
        label='Description'
        placeholder='Enter problem description'
      />
      <FormField
        control={form.control}
        name='language'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Code Language</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select a language' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='java'>Java</SelectItem>
                <SelectItem value='csharp'>C#</SelectItem>
                <SelectItem value='python'>Python</SelectItem>
                <SelectItem value='c'>C</SelectItem>
                <SelectItem value='cpp'>C++</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <VariablesManager variables={variables} setVariables={setVariables} />
    </div>
  )
}
