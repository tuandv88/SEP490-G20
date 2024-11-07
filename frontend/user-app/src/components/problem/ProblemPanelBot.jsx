/* eslint-disable react/prop-types */
import { Trophy } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const StatsPanel = ({ stats }) => {
  const userStats = {
    name: 'Tuan Dep Trai',
    score: 9999,
    rank: 1,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* User Info Section */}
      <div className='flex items-center gap-4 pb-6 border-b border-gray-100'>
        <Avatar className='h-16 w-16'>
          <AvatarImage src={userStats.avatar} alt={userStats.name} />
          <AvatarFallback>
            {userStats.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className='font-semibold text-lg'>{userStats.name}</h3>
          <div className='flex items-center gap-4 mt-1'>
            <div className='flex items-center gap-1'>
              <Trophy className='w-4 h-4 text-yellow-500' />
              <span className='text-sm text-gray-600'>Score: {userStats.score}</span>
            </div>
            <div className='text-sm text-gray-600'>Rank: #{userStats.rank}</div>
          </div>
        </div>
      </div>

      {/* Problem Progress Section */}
      <h2 className='text-lg font-semibold mb-4 mt-6'>Problem Progress</h2>
      <div className='space-y-3'>
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-green-600'>Easy</span>
            <span className='text-gray-600'>
              {stats.easy}/{stats.totalEasy}
            </span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-green-500 rounded-full'
              style={{ width: `${(stats.easy / stats.totalEasy) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-yellow-600'>Medium</span>
            <span className='text-gray-600'>
              {stats.medium}/{stats.totalMedium}
            </span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-yellow-500 rounded-full'
              style={{ width: `${(stats.medium / stats.totalMedium) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-red-600'>Hard</span>
            <span className='text-gray-600'>
              {stats.hard}/{stats.totalHard}
            </span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-red-500 rounded-full'
              style={{ width: `${(stats.hard / stats.totalHard) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
