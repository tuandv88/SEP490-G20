import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MarkdownFormField from '@/components/markdown-form-field'
import { Switch } from '@/components/ui/switch'

export default function BasicInfoStep({ form }) {
  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='mb-6 text-3xl font-semibold'>Create Code Problem - Basic Info</h1>
      <div className='mb-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter problem title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <MarkdownFormField
        control={form.control}
        name='description'
        label='Description'
        placeholder='Enter problem description'
      />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        {/* Language Dropdown */}
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Code Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || 'Java'}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a language' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Java'>Java</SelectItem>
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

        
        {/* Difficulty Type Dropdown */}
        <FormField
          control={form.control}
          name='difficultyType'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Difficulty Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || 'Medium'}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select difficulty type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Easy'>Easy</SelectItem>
                  <SelectItem value='Medium'>Medium</SelectItem>
                  <SelectItem value='Hard'>Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPU Time Limit */}
        <FormField
          control={form.control}
          name='cpuTimeLimit'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>CPU Time Limit</FormLabel>
              <FormControl>
                <Input
                  min={0.1}
                  max={20}
                  type='number'
                  step='0.1'
                  placeholder='Enter CPU Time Limit'
                  {...field}
                  value={field.value || 2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPU Extra Time */}
        <FormField
          control={form.control}
          name='cpuExtraTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>CPU Extra Time</FormLabel>
              <FormControl>
                <Input
                  min={0}
                  max={5}
                  type='number'
                  step='0.1'
                  placeholder='Enter CPU Extra Time'
                  {...field}
                  value={field.value || 2.5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Memory Limit */}
        <FormField
          control={form.control}
          name='memoryLimit'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Memory Limit (MB)</FormLabel>
              <FormControl>
                <Input
                  min={50}
                  max={500}
                  type='number'
                  step='1'
                  placeholder='Enter Memory Limit'
                  {...field}
                  value={field.value || 250}                 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stack Limit */}
        <FormField
          control={form.control}
          name='stackLimit'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Stack Limit (MB)</FormLabel>
              <FormControl>
                <Input
                  min={30}
                  max={125}
                  type='number'
                  step='1'
                  placeholder='Enter Stack Limit'
                  {...field}
                  value={field.value || 64}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Thread */}
        <FormField
          control={form.control}
          name='maxThread'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Max Thread</FormLabel>
              <FormControl>
                <Input
                  min={20}
                  max={120}
                  type='number'
                  step='0.1'
                  placeholder='Enter Max Thread'
                  {...field}
                  value={field.value || 70}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max File Size */}
        <FormField
          control={form.control}
          name='maxFileSize'         
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Max File Size (MB)</FormLabel>
              <FormControl>
                <Input
                  min={1}
                  max={20}
                  type='number'
                  step='1'
                  placeholder='Enter Max File Size'
                  {...field}
                  value={field.value || 10}                  
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div></div>
        
        {/* Enable Network Toggle */}
        <FormField
          control={form.control}
          name='enableNetwork'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center'>
                <FormLabel className='text-base font-semibold'>Enable Network</FormLabel>
                <FormControl>
                  <Switch
                    className='ml-2'
                    checked={field.value}
                    defaultChecked={false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Active Toggle */}
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center'>
                <FormLabel className='text-base font-semibold'>Is Active</FormLabel>
                <FormControl>
                  <Switch
                    className='ml-2'
                    checked={field.value}
                    defaultChecked={true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
