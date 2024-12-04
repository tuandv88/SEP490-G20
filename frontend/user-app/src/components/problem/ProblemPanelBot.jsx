/* eslint-disable react/prop-types */
import { Trophy } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '@/contexts/UserContext'
import authServiceInstance from '@/oidc/AuthService'

const StatsPanel = ({ problemSolved, leaderboardData }) => {
  const { user, updateUser } = useContext(UserContext)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    if (!user) {
      // Lấy thông tin người dùng nếu chưa có
      authServiceInstance.getUser().then((userData) => {
        if (userData) {
          updateUser(userData)
        }
      })
    } else if (leaderboardData && leaderboardData.ranks && Array.isArray(leaderboardData.ranks.data)) {
      // Tìm thứ hạng của người dùng trong leaderboardData
      const rankIndex = leaderboardData.ranks.data.findIndex((item) => item.userId === user.profile.sub)
      if (rankIndex !== -1) {
        setUserRank(rankIndex + 1)
      }
    }
  }, [user, updateUser, leaderboardData])

  if (!user) {
    return null
  }

  if (!problemSolved || !problemSolved.solved) {
    return null
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center gap-4 pb-6 border-b border-gray-100'>
        <Avatar className='h-16 w-16'>
          <AvatarImage src={user.profile.urlImagePresigned} alt='User Avatar' />
        </Avatar>
        <div>
          <h3 className='font-semibold text-lg'>{user.profile.firstName + ' ' + user.profile.lastName}</h3>
          <div className='flex items-center gap-4 mt-1'>
            <div className='flex items-center gap-1'>
              <Trophy className='w-4 h-4 text-yellow-500' />
              {userRank && <span>#Rank: {userRank}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Progress Section */}
      <h2 className='text-lg font-semibold mb-4 mt-6'>Problem Progress</h2>
      <div className='space-y-3'>
        {/* Easy Level */}
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-green-600'>Easy</span>
            <span className='text-gray-600'>
              {problemSolved.solved.easy.solvedCount}/{problemSolved.solved.easy.totalCount}
            </span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-green-500 rounded-full'
              style={{
                width: `${problemSolved.solved.easy.totalCount ? (problemSolved.solved.easy.solvedCount / problemSolved.solved.easy.totalCount) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        {/* Medium Level */}
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-yellow-600'>Medium</span>
            <span className='text-gray-600'>
              {problemSolved.solved.medium.solvedCount}/{problemSolved.solved.medium.totalCount}
            </span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-yellow-500 rounded-full'
              style={{
                width: `${problemSolved.solved.medium.totalCount ? (problemSolved.solved.medium.solvedCount / problemSolved.solved.medium.totalCount) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        {/* Hard Level */}
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-red-600'>Hard</span>
            <span className='text-gray-600'>
              {problemSolved.solved.hard.solvedCount}/{problemSolved.solved.hard.totalCount}
            </span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-red-500 rounded-full'
              style={{
                width: `${problemSolved.solved.hard.totalCount ? (problemSolved.solved.hard.solvedCount / problemSolved.solved.hard.totalCount) * 100 : 0}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
