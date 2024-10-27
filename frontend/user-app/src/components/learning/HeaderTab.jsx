/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'

const HeaderTab = ({ activeTab, setActiveTab }) => {
  return (
    <div className='bg-gray-800 text-white p-3 sticky top-0 z-10'>
      <nav className='flex space-x-4'>
        <button
          className={`px-3 py-2 rounded-full text-sm font-medium ${activeTab === 'curriculum' ? 'border border-white border-solid' : ' bg-gray-900 hover:bg-gray-700'}`}
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </button>
        <button
          className={`px-3 py-2 rounded-full text-sm font-medium ${activeTab === 'descriptions' ? 'border border-white border-solid' : 'bg-gray-900 hover:bg-gray-700'}`}
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

    // <div className="relative flex items-center bg-gray-800 text-white">
    //   <div
    //     className="flex overflow-x-auto scrollbar-hide space-x-4 px-12 py-3"
    //   >

    //       <button
    //         onClick={() => setActiveTab('video')}
    //         className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
    //           activeTab === 'video'
    //             ? 'bg-gray-900 text-white'
    //             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //         }`}
    //       >Video
    //       </button>

    //       <button
    //         onClick={() => setActiveTab('markdown')}
    //         className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
    //           activeTab === 'markdown'
    //             ? 'bg-gray-900 text-white'
    //             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    //         }`}
    //       >Description
    //       </button>

    //   </div>
    // </div>
  )
}

export default HeaderTab
