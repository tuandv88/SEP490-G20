import React from 'react'
import BasicInfoStep from '@/components/CreateCourse/CreateCodeProblem/basic-info-step'
import CodeEditor from '@/pages/Problem/Create/CodeEditor'
import Template from '@/pages/Problem/Create/Template';

const FormTabs = ({ activeTab, form, setIsSaveTemplate }) => {

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
          <Template form={form} setIsSaveTemplate={setIsSaveTemplate} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(FormTabs);
