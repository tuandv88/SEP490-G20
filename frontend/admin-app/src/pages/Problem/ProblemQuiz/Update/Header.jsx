import { ArrowLeft } from 'lucide-react'

export default function Header({ backTo }) {
  return (
    <header className='sticky top-0 left-0 right-0 bg-white border-b border-gray-200 z-1'>
      <div className='max-w-4xl mx-auto px-4 h-14 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button className='text-black flex items-center hover:text-purple-700' onClick={() => navigate(backTo)}>
            <ArrowLeft className='h-5 w-5 mr-2' />
            <span>{backTo}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
