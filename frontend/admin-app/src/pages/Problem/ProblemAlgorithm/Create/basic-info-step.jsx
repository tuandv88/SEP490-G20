import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MarkdownFormField from '@/components/markdown-form-field'
import { Switch } from '@/components/ui/switch'
import * as z from "zod"

export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  language: z.string().min(1, "Language is required"),
  problemType: z.string().default("Challenge"),
  difficultyType: z.string().min(1, "Difficulty type is required"),
  cpuTimeLimit: z.number()
    .min(0.1, "CPU time limit must be at least 0.1")
    .max(20, "CPU time limit must not exceed 20"),
  cpuExtraTime: z.number()
    .min(0, "CPU extra time must be at least 0")
    .max(5, "CPU extra time must not exceed 5"),
  memoryLimit: z.number()
    .min(50, "Memory limit must be at least 50MB")
    .max(500, "Memory limit must not exceed 500MB"),
  stackLimit: z.number()
    .min(30, "Stack limit must be at least 30MB")
    .max(125, "Stack limit must not exceed 125MB"),
  maxThread: z.number()
    .min(20, "Max thread must be at least 20")
    .max(120, "Max thread must not exceed 120"),
  maxFileSize: z.number()
    .min(1, "Max file size must be at least 1MB")
    .max(20, "Max file size must not exceed 20MB"),
  enableNetwork: z.boolean(),
  isActive: z.boolean(),
  testCases: z.any(),
  createTestScriptDto: z.array(
    z.object({
      fileName: z.string(),
      template: z.string(),
      testCode: z.string(),
      description: z.string(),
      languageCode: z.string(),
      solutions: z.array(
        z.object({
          fileName: z.string(),
          solutionCode: z.string(),
          description: z.string(),
          languageCode: z.string(),
          priority: z.boolean()
        })
      )
    })
  ).optional()
})

export default function BasicInfoStep({ form }) {
  console.log("Run")
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
                  type='number'
                  min={0.1}
                  max={20}
                  step='0.1'
                  placeholder='Enter CPU Time Limit'
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === '' ? '' : field.value}
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
                  type='number'
                  min={0}
                  max={5}
                  step='0.1'
                  placeholder='Enter CPU Extra Time'
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === '' ? '' : field.value}
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
                  type='number'
                  min={50}
                  max={500}
                  step='1'
                  placeholder='Enter Memory Limit'
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === '' ? '' : field.value}
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
                  type='number'
                  min={30}
                  max={125}
                  step='1'
                  placeholder='Enter Stack Limit'
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === '' ? '' : field.value}
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
                  type='number'
                  min={20}
                  max={120}
                  step='1'
                  placeholder='Enter Max Thread'
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === '' ? '' : field.value}
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
                  type='number'
                  min={1}
                  max={20}
                  step='1'
                  placeholder='Enter Max File Size'
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === '' ? '' : field.value}
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
