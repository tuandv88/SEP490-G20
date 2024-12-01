import { UserAPI } from '@/services/api/userApi';
import { Dot, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'


const ProblemPanelTop = ({ leaderboardData }) => {

  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    if (
      leaderboardData &&
      typeof leaderboardData === 'object' &&
      leaderboardData.ranks &&
      Array.isArray(leaderboardData.ranks.data) &&
      leaderboardData.ranks.data.length > 0
    ) {
      const fetchUserDetails = async () => {
        const users = await Promise.all(
          leaderboardData.ranks.data.map(async (user, index) => {
            const userData = await UserAPI.getUserById(user.userId);          
            return {
              ...user,
              name: userData.firstName + ' ' + userData.lastName,
              avatar: userData.urlProfilePicture,
              rank: index + 1,
            };
          })
        );
        setUserDetails(users);
      };

      fetchUserDetails();
    }
  }, [leaderboardData]);

  if (
    !leaderboardData ||
    !leaderboardData.ranks ||
    !Array.isArray(leaderboardData.ranks.data) ||
    leaderboardData.ranks.data.length === 0 ||
    userDetails.length === 0
  ) {
    return null;
  }

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
            <img src={user.avatar} alt={user.name} className='w-8 h-8 rounded-full object-cover' />
            <div className='flex-1'>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-blue-600'>{user.name}</span>
               
              </div>
              <div className='text-[12px] text-gray-600'>
                #Rank: {user.rank} 
                {/* <Dot className='inline-block' /> Attended: {user.attended} */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className='w-full h-[1px] mt-5' />

      {/* <Link
        to='/leaderboard'
        className='mt-4 block text-center py-2 px-4 bg-blue-50 text-black font-semibold rounded-md hover:bg-blue-100 transition-colors'
      >
        View Leaderboard
      </Link> */}
    </div>
  )
}

export default ProblemPanelTop
