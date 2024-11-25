import React from 'react'
import BasicInfoStep from '@/components/CreateCourse/CreateCodeProblem/basic-info-step'
import CodeEditor from '@/pages/Problem/ProblemLecture/Create/CodeEditor'
import Template from '@/pages/Problem/ProblemLecture/Create/Template';

const FormTabs = ({ activeTab, form, setIsSaveTemplate, setIsRunSuccess, hasLecture }) => {

  return (
    <div className='mx-auto px-4 py-24'>
      <div className='space-y-6'>
        <div style={{ display: activeTab === 'basic' ? 'block' : 'none' }}>
          <BasicInfoStep form={form} hasLecture={hasLecture} />
        </div>
        <div style={{ display: activeTab === 'code' ? 'block' : 'none' }}>
          <CodeEditor form={form} setIsRunSuccess={setIsRunSuccess} />
        </div>
        <div style={{ display: activeTab === 'description' ? 'block' : 'none' }}>
          <Template form={form} setIsSaveTemplate={setIsSaveTemplate} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(FormTabs);
