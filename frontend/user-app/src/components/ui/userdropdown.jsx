// // eslint-disable-next-line react/prop-types, no-unused-vars
import { UserContext } from '@/contexts/UserContext'
import { useContext } from 'react'
export default function DropdownMenuUser({ isOpen, userName }) {
  const menuItems = [
    { icon: '📋', label: 'My Lists' },
    { icon: '📓', label: 'Notebook' },
    { icon: '❓', label: 'Submissions' },
    { icon: '📊', label: 'Progress' },
    { icon: '🪙', label: 'Points' }
  ]

// import { UserContext } from '@/contexts/UserContext'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger
// } from './dropdown-menu'
// import { Avatar, AvatarFallback, AvatarImage } from './avatar'
// import { LogOut, Settings, User } from 'lucide-react'

// import { Button } from './button'

  const additionalItems = ['My Profile', 'Settings', 'Sign out']


  const user = useContext(UserContext)

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
            src={user.profile.urlImagePresigned}
            alt=''
          />
          <div>
            <p className='text-sm font-medium text-gray-900'>{userName}</p>
          </div>
        </div>
      </div>

      {/* <div className='py-2'>
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
      </div> */}

      <div className='py-1'>
        <button
          onClick={() => {
            navigate(AR.PROFILE)
          }}
          className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
        >
          My Profile
        </button>

        <button
          className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
        >
          Settings
        </button>

        <button
          className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

// export function DropdownMenuUser({ isOpen }) {
//   const user = useContext(UserContext)

//   if (!isOpen) return null

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
//           <Avatar className='h-8 w-8'>
//             <AvatarImage src={user.profile.urlImagePresigned} />
//             <AvatarFallback>{user.profile.firstName.charAt(0)}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className='w-56' align='end' forceMount>
//         <DropdownMenuLabel className='font-normal'>
//           <div className='flex flex-col space-y-1'>
//             <p className='text-sm font-medium leading-none'>
//               {user.profile.firstName + ' ' + user.profile.lastName}
//             </p>
//             <p className='text-xs leading-none text-muted-foreground'>{user.profile.email}</p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <User className='mr-2 h-4 w-4' />
//             <span>Profile</span>
//             <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Settings className='mr-2 h-4 w-4' />
//             <span>Settings</span>
//             <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>
//           <LogOut className='mr-2 h-4 w-4' />
//           <span>Log out</span>
//           <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
