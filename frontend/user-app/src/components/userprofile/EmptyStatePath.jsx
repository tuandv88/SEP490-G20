import React from 'react'
import { Map, PlusCircle } from 'lucide-react'

export default function EmptyStatePath() {
  return (
    <div className='bg-white rounded-xl p-12 text-center shadow-lg'>
      <div className='flex justify-center mb-6'>
        <div className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center'>
          <Map size={40} className='text-red-500' />
        </div>
      </div>
      <h3 className='text-xl font-bold mb-2'>Chưa có lộ trình nào</h3>
      <p className='text-gray-600 mb-8 max-w-md mx-auto'>
        Hãy tạo lộ trình học tập của riêng bạn hoặc để AI gợi ý một lộ trình phù hợp với mục tiêu của bạn.
      </p>
      <button className='flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors mx-auto'>
        <PlusCircle size={20} />
        Tạo lộ trình mới
      </button>
    </div>
  )
}
