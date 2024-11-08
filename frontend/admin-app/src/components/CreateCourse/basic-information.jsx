import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BasicInformation() {
  const [courseData, setCourseData] = useState({
    title: '',
    headline: '',
    description: '',
    prerequisite: '',
    objective: '',
    targetAudience: '',
    image: null,
    courseLevel: '',
    price: '',
    timeEstimate: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setCourseData((prev) => ({ ...prev, image: file }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(courseData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h1 className='mb-6 text-2xl font-bold'>Basic Information</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='title'>Course Title</Label>
          <Input
            id='title'
            name='title'
            value={courseData.title}
            onChange={handleInputChange}
            placeholder='Enter course title'
          />
        </div>
        <div>
          <Label htmlFor='headline'>Headline</Label>
          <Input
            id='headline'
            name='headline'
            value={courseData.headline}
            onChange={handleInputChange}
            placeholder='Enter course headline'
          />
        </div>
        <div>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            name='description'
            value={courseData.description}
            onChange={handleInputChange}
            placeholder='Enter course description'
          />
        </div>
        <div>
          <Label htmlFor='prerequisite'>Prerequisite</Label>
          <Textarea
            id='prerequisite'
            name='prerequisite'
            value={courseData.prerequisite}
            onChange={handleInputChange}
            placeholder='Enter course prerequisites'
          />
        </div>
        <div>
          <Label htmlFor='objective'>Objective</Label>
          <Textarea
            id='objective'
            name='objective'
            value={courseData.objective}
            onChange={handleInputChange}
            placeholder='Enter course objectives'
          />
        </div>
        <div>
          <Label htmlFor='targetAudience'>Target Audience</Label>
          <Input
            id='targetAudience'
            name='targetAudience'
            value={courseData.targetAudience}
            onChange={handleInputChange}
            placeholder='Enter target audience'
          />
        </div>
        <div>
          <Label htmlFor='image'>Course Image</Label>
          <Input id='image' name='image' type='file' accept='image/*' onChange={handleImageUpload} />
        </div>
        <div>
          <Label htmlFor='courseLevel'>Course Level</Label>
          <Select
            name='courseLevel'
            value={courseData.courseLevel}
            onValueChange={(value) => setCourseData((prev) => ({ ...prev, courseLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select course level' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Basic'>Basic</SelectItem>
              <SelectItem value='Intermediate'>Intermediate</SelectItem>
              <SelectItem value='Advanced'>Advanced</SelectItem>
              <SelectItem value='Expert'>Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='price'>Price (USD)</Label>
          <Input
            id='price'
            name='price'
            type='number'
            min='0'
            step='0.01'
            value={courseData.price}
            onChange={handleInputChange}
            placeholder='Enter course price'
          />
        </div>
        <div>
          <Label htmlFor='timeEstimate'>Time Estimate (hours)</Label>
          <Input
            id='timeEstimate'
            name='timeEstimate'
            type='number'
            min='0'
            step='0.5'
            value={courseData.timeEstimate}
            onChange={handleInputChange}
            placeholder='Enter estimated time to complete'
          />
        </div>
        <Button type='submit'>Save Basic Information</Button>
      </form>
    </div>
  )
}
