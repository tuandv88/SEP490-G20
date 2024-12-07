import { UserAPI } from '@/services/api/userApi';
import { Dot, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

const ProblemPanelTop = ({ leaderboardData }) => {
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    if (leaderboardData?.ranks?.data?.length > 0) {
      const fetchUserDetails = async () => {
        try {
          const users = await Promise.all(
            leaderboardData.ranks.data.map(async (user, index) => {
              try {
                const userData = await UserAPI.getUserById(user.userId);
                return {
                  ...user,
                  name: userData.firstName + ' ' + userData.lastName,
                  avatar: userData.urlProfilePicture,
                  rank: index + 1,
                  solvedCount: user.solvedCount,
                  error: false
                };
              } catch (error) {
                // Trả về user với thông tin mặc định nếu không fetch được
                return {
                  ...user,
                  name: 'Unknown User',
                  avatar: 'https://via.placeholder.com/150',
                  rank: index + 1,
                  solvedCount: user.solvedCount,
                  error: true
                };
              }
            })
          );
          // Lọc bỏ các user bị lỗi nếu muốn
          // const validUsers = users.filter(user => !user.error);
          setUserDetails(users);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [leaderboardData]);

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Trophy className='w-5 h-5 text-yellow-500' />
        <h2 className='text-lg font-semibold'>Global Ranking</h2>
      </div>

      <div className='space-y-4'>
        {userDetails.map((user) => (
          <div key={user.rank} className='flex items-center gap-3'>
            <span className='w-4 text-gray-500 font-medium'>{user.rank}</span>
            <img 
              src={user.avatar} 
              alt="avatar" 
              className={`w-8 h-8 rounded-full object-cover ${user.error ? 'opacity-50' : ''}`}
            />
            <div className='flex-1'>
              <div className='flex items-center gap-1'>
                <span className={`font-medium ${user.error ? 'text-gray-400' : 'text-blue-600'}`}>
                  {user.name}
                </span>
              </div>
              <div className='text-[12px] text-gray-600 flex items-center'>
                <span>Rank: {user.rank}</span>
                <Dot className='inline-block' />
                <span>Solved: {user.solvedCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className='w-full h-[1px] mt-5' />
    </div>
  )
}

export default ProblemPanelTop
