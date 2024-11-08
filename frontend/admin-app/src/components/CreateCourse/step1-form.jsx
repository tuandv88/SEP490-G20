/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function Step1Form({
  courseData,
  handleInputChange,
  //   handleImageUpload,
  handleNextStep
}) {
  return (
    <div className='space-y-4'>
      <Input name='title' placeholder='Course Title' value={courseData.title} onChange={handleInputChange} />
      <Input name='headline' placeholder='Headline' value={courseData.headline} onChange={handleInputChange} />
      <Textarea
        name='description'
        placeholder='Description'
        value={courseData.description}
        onChange={handleInputChange}
      />
      <Textarea
        name='prerequisite'
        placeholder='Prerequisite'
        value={courseData.prerequisite}
        onChange={handleInputChange}
      />
      <Textarea name='objective' placeholder='Objective' value={courseData.objective} onChange={handleInputChange} />
      {/* <Input
        type="file"
        name="imageCourse"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleImageUpload(file);
          }
        }}
      /> */}
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='imageFile'>Image for Course</Label>
        <Input name='imageCourse' id='imageFile' type='file' />
      </div>
      <Input
        name='targetAudience'
        placeholder='Target Audience'
        value={courseData.targetAudience}
        onChange={handleInputChange}
      />
      <Input
        name='timeEstimateDone'
        type='time'
        placeholder='Estimated Time to Complete'
        value={courseData.timeEstimateDone}
        onChange={handleInputChange}
      />
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select a level' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Level of Course</SelectLabel>
            <SelectItem value='basic'>Basic</SelectItem>
            <SelectItem value='intermediate'>Intermediate</SelectItem>
            <SelectItem value='advanced'>Advanced</SelectItem>
            <SelectItem value='expert'>Expert</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        name='price'
        type='number'
        min='0'
        step='0.01'
        placeholder='Price'
        value={courseData.price}
        onChange={handleInputChange}
      />
      <Button onClick={() => {}} className='mr-2'>
        Back
      </Button>
      <Button onClick={handleNextStep}>Next to Step 2</Button>
    </div>
  )
}
