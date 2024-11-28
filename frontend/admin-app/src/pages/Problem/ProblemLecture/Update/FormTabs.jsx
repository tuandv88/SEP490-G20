import React from 'react'
import BasicInfoStep from '@/pages/Problem/ProblemLecture/Update/basic-info-step'
import CodeEditor from '@/pages/Problem/ProblemLecture/Update/CodeEditor'
import Template from '@/pages/Problem/ProblemLecture/Update/Template';

const FormTabs = ({ activeTab, form, setIsSaveTemplate, setIsRunSuccess, testCaseUpdate, solutionUpdate }) => {

  return (
    <div className='mx-auto px-4 py-24'>
      <div className='space-y-6'>
        <div style={{ display: activeTab === 'basic' ? 'block' : 'none' }}>
          <BasicInfoStep form={form} />
        </div>
        <div style={{ display: activeTab === 'code' ? 'block' : 'none' }}>
          <CodeEditor form={form} setIsRunSuccess={setIsRunSuccess} testCaseUpdate={testCaseUpdate} solutionUpdate={solutionUpdate} />
        </div>
        <div style={{ display: activeTab === 'description' ? 'block' : 'none' }}>
          <Template form={form} setIsSaveTemplate={setIsSaveTemplate} templateUpdate={solutionUpdate.template} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(FormTabs);
