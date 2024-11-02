/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react'

const HeaderTab = ({ activeTab, setActiveTab }) => {
  return (
    <div className='bg-gray-800 text-white p-2 sticky top-0 z-10'>
      <nav className='flex space-x-4'>
        {/* <button
          className={`px-3 py-2 rounded-full text-sm font-medium ${activeTab === 'curriculum' ? 'border border-white border-solid' : ' bg-gray-900 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </button> */}
        <button
          className={`px-2 py-1 rounded-full text-[13px] font-medium ${activeTab === 'descriptions' ? 'border border-white border-solid' : 'bg-gray-900 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('descriptions')}
        >
          Descriptions
        </button>

        <button
          className={`px-3 py-2 rounded-full text-sm font-medium ${activeTab === 'comments' ? 'border border-white border-solid' : 'bg-gray-900 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
      </nav>
    </div>
  )
}

export default React.memo(HeaderTab)
