// eslint-disable-next-line react/prop-types, no-unused-vars
export default function DropdownMenuUser({ isOpen, userName }) {
  const menuItems = [
    { icon: '📋', label: 'My Lists' },
    { icon: '📓', label: 'Notebook' },
    { icon: '❓', label: 'Submissions' },
    { icon: '📊', label: 'Progress' },
    { icon: '🪙', label: 'Points' }
  ]

  const additionalItems = ['My Profile', 'Settings', 'Sign out']

  if (!isOpen) return null

  return (
    <div
      className='absolute right-0 mt-6 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none'
      role='menu'
      aria-orientation='vertical'
      aria-labelledby='options-menu'
    >
      <div className='px-4 py-3'>
        <div className='flex items-center'>
          <img
            className='w-10 h-10 mr-3 rounded-full'
            src='https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?height=40&width=40'
            alt=''
          />
          <div>
            <p className='text-sm font-medium text-gray-900'>{userName}</p>
          </div>
        </div>
      </div>

      <div className='py-2'>
        <div className='grid grid-cols-3 gap-2 px-2'>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className='flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
              role='menuitem'
            >
              <span className='mb-1 text-2xl'>{item.icon}</span>
              <span className='text-xs'>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='py-1'>
        {additionalItems.map((item, index) => (
          <button
            key={index}
            className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
            role='menuitem'
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
