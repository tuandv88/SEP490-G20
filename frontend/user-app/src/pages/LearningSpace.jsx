/* eslint-disable no-unused-vars */
import CodeEditor from '@/components/learning/CodeEditor'
import Comments from '@/components/learning/Comment'
import Curriculum from '@/components/learning/Curriculum'
import Component from '@/components/learning/Description'
import HeaderTab from '@/components/learning/HeaderTab'
import React, { useState } from 'react'
import Split from 'react-split'

const LearningSpace = () => {
  const [activeTab, setActiveTab] = useState('curriculum')

  return (
    <Split className='split' sizes={[40, 70]} gutterSize={3}>
      <div className='scroll-container h-screen min-w-[500px]'>
        <HeaderTab activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'curriculum' && <Curriculum />}
        {activeTab === 'descriptions' && <Component />}
        {activeTab === 'comments' && <Comments />}
      </div>
      <div>
        {/* <QuizScreen></QuizScreen> */}
        <CodeEditor></CodeEditor>
      </div>
    </Split>
  )
}

export default LearningSpace
