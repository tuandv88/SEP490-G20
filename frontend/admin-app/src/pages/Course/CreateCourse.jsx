import { useState } from 'react'
import Sidebar from '@/components/CreateCourse/sidebar'
import BasicInformation from '@/components/CreateCourse/basic-information'
import Curriculum from '@/components/CreateCourse/curriculum'

export default function CreateCoursePage() {
  const [activeSection, setActiveSection] = useState('basic-information')

  const renderContent = () => {
    switch (activeSection) {
      case 'basic-information':
        return <BasicInformation />
      case 'curriculum':
        return <Curriculum />
      default:
        return <BasicInformation />
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className='flex-1 p-8 overflow-auto'>{renderContent()}</div>
    </div>
  )
}
