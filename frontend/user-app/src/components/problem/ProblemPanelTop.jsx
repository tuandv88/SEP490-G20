import { Dot, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

const leaderboardData = [
  {
    rank: 1,
    name: 'Top 1',
    country: 'US',
    rating: 3686,
    attended: 51,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  },
  {
    rank: 2,
    name: 'TuanVP',
    country: 'CN',
    rating: 3645,
    attended: 239,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  },
  {
    rank: 3,
    name: 'TuanDV',
    country: 'AU',
    rating: 3642,
    attended: 98,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  },
  {
    rank: 4,
    name: 'Hello VN',
    country: 'CN',
    rating: 3578,
    attended: 143,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  },
  {
    rank: 5,
    name: 'Leu Leu',
    country: 'CN',
    rating: 3576,
    attended: 103,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  },
  {
    rank: 6,
    name: 'Tuan Vinh',
    country: 'CN',
    rating: 3542,
    attended: 55,
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKsfTHylfAszH0NVPU4Zj-X21su07AFw9wCwAZgiEM4hTEffIZ0EQ=s288-c-no'
  }
]

const ProblemPanelTop = () => {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Trophy className='w-5 h-5 text-yellow-500' />
        <h2 className='text-lg font-semibold'>Global Ranking</h2>
      </div>

      <div className='space-y-4'>
        {leaderboardData.map((user) => (
          <div key={user.rank} className='flex items-center gap-3'>
            <span className='w-4 text-gray-500 font-medium'>{user.rank}</span>
            <img src={user.avatar} alt={user.name} className='w-8 h-8 rounded-full object-cover' />
            <div className='flex-1'>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-blue-600'>{user.name}</span>
                {/* <span className='text-xs text-gray-500 uppercase'>{user.country}</span> */}
              </div>
              <div className='text-[12px] text-gray-600'>
                Rating: {user.rating} <Dot className='inline-block' /> Attended: {user.attended}
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className='w-full h-[1px] mt-5' />

      <Link
        to='/leaderboard'
        className='mt-4 block text-center py-2 px-4 bg-blue-50 text-black font-semibold rounded-md hover:bg-blue-100 transition-colors'
      >
        View Leaderboard
      </Link>
    </div>
  )
}

export default ProblemPanelTop
