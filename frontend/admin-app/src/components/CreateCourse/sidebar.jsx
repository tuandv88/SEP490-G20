/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button'

export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: 'basic-information', label: 'Basic Information' },
    { id: 'curriculum', label: 'Curriculum' }
  ]

  return (
    <div className='w-64 bg-gray-100 border-r border-gray-200 shadow-sm'>
      <div className='p-6'>
        <h2 className='mb-6 text-xl font-semibold text-gray-800'>Course Creation</h2>
        <nav className='space-y-3'>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              className={`justify-start w-full text-left px-4 py-2 rounded-lg ${
                activeSection === item.id ? 'bg-gray-300 text-gray-900' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className='p-4 border-t border-gray-200'>
        <Button className='w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700'>Submit</Button>
      </div>
    </div>
  )
}
