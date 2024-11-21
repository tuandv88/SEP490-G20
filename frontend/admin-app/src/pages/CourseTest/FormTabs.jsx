import BasicInfoStep from '@/components/CreateCourse/CreateCodeProblem/basic-info-step'
import DescriptionTab from '@/components/Tabs/DescriptionTab'
import CodeEditor from '@/pages/CourseTest/CodeEditor'

export default function FormTabs({ activeTab, form, setIsSaveTemplate }) {
  const renderTab = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoStep form={form} />
      case 'code':
        return <CodeEditor form={form} />
      case 'description':
        return <DescriptionTab form={form}  />
      default:
        return null
    }
  }

  return (
    <div className='mx-auto px-4 py-24'>
      <div className='space-y-6'>
        <div style={{ display: activeTab === 'basic' ? 'block' : 'none' }}>
          <BasicInfoStep form={form} />
        </div>
        <div style={{ display: activeTab === 'code' ? 'block' : 'none' }}>
          <CodeEditor form={form} />
        </div>
        <div style={{ display: activeTab === 'description' ? 'block' : 'none' }}>
          <DescriptionTab form={form} setIsSaveTemplate={setIsSaveTemplate} />
        </div>
      </div>
    </div>
  )
}
