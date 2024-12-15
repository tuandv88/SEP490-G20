import React, { useState, useEffect } from 'react'
import { Trophy, Medal } from 'lucide-react'
import { ProblemAPI } from '@/services/api/problemApi'
import { UserAPI } from '@/services/api/userApi'
import { format, subDays, subMonths, subYears, startOfDay } from 'date-fns'
import { Loading } from '@/components/ui/overlay'
import LeaderboardLoading from '@/components/loading/LeaderboardLoading'
import Layout from '@/layouts/layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TIME_RANGES = {
  ALL: 'all',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year'
}

const LeaderBoard = () => {
  const [timeRange, setTimeRange] = useState(TIME_RANGES.ALL)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const updateDateRange = (range) => {
    const now = new Date()
    const end = format(now, 'yyyy-MM-dd')
    let start = end

    switch (range) {
      case TIME_RANGES.DAY:
        start = format(subDays(now, 1), 'yyyy-MM-dd')
        break
      case TIME_RANGES.MONTH:
        start = format(subMonths(now, 1), 'yyyy-MM-dd')
        break
      case TIME_RANGES.YEAR:
        start = format(subYears(now, 1), 'yyyy-MM-dd')
        break
      case TIME_RANGES.ALL:
        start = format(new Date(2020, 0, 1), 'yyyy-MM-dd')
        break
      default:
        break
    }

    setStartDate(start)
    setEndDate(end)
    setTimeRange(range)
  }

  useEffect(() => {
    updateDateRange(TIME_RANGES.ALL)
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      fetchLeaderboardData()
    }
  }, [startDate, endDate])

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const startDateTime = startOfDay(new Date(startDate)).toISOString()
      const endDateTime = new Date(endDate).toISOString()

      const response = await ProblemAPI.getLeaderboard(1, 10, startDateTime, endDateTime)
      
      const leaderboardWithUserDetails = await Promise.all(
        response.ranks.data.map(async (rank, index) => {
          try {
            const userResponse = await UserAPI.getUserById(rank.userId)
            return {
              ...rank,
              rank: index + 1,
              username: userResponse.firstName + ' ' + userResponse.lastName,
              avatar: userResponse.urlProfilePicture || 'default-avatar-url.jpg'
            }
          } catch (error) {
            return {
              ...rank,
              rank: index + 1,
              username: 'Unknown User',
              avatar: 'default-avatar-url.jpg'
            }
          }
        })
      )

      setLeaderboardData(leaderboardWithUserDetails)
    } catch (error) {
      setError('Failed to load leaderboard data')
    } finally {
      setLoading(false)
    }
  }

  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-amber-600'
      default:
        return 'text-gray-600'
    }
  }

  

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-red-500'>{error}</div>
      </div>
    )
  }

  return (
    <Layout> 
      <div className='min-h-screen p-6 mt-[70px]'>
        <div className='max-w-4xl mx-auto'>
          {loading ? <LeaderboardLoading /> : (
          <div className='bg-white rounded-2xl shadow-xl p-6 mb-8'>
            <div className='flex items-center justify-between mb-8'>
              <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                <Trophy className='h-8 w-8 text-yellow-500' />
                Leaderboard
              </h1>
              <div className='w-[200px]'>
                <Select
                  value={timeRange}
                  onValueChange={(value) => updateDateRange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TIME_RANGES.ALL}>All Time</SelectItem>
                    <SelectItem value={TIME_RANGES.DAY}>Last 24 Hours</SelectItem>
                    <SelectItem value={TIME_RANGES.MONTH}>Last Month</SelectItem>
                    <SelectItem value={TIME_RANGES.YEAR}>Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-4'>
              {leaderboardData.map((user) => (
                <div
                  key={user.userId}
                  className='flex items-center p-4 bg-white border rounded-xl hover:shadow-md transition-shadow'
                >
                  <div className='w-12 text-center font-bold text-xl'>
                    {user.rank === 1 && <Trophy className='h-6 w-6 mx-auto text-yellow-500' />}
                    {user.rank === 2 && <Medal className='h-6 w-6 mx-auto text-gray-400' />}
                    {user.rank === 3 && <Medal className='h-6 w-6 mx-auto text-amber-600' />}
                    {user.rank > 3 && <span className='text-gray-600'>#{user.rank}</span>}
                  </div>
                  <div className='flex-shrink-0 ml-4'>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className='w-12 h-12 rounded-full border-2 border-purple-200'
                    />
                  </div>
                  <div className='ml-6 flex-grow'>
                    <h3 className='text-lg font-semibold text-gray-800'>{user.username}</h3>
                    <p className='text-sm text-gray-600'>Solved Problems: {user.solvedCount}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${getMedalColor(user.rank)}`}>
                    <span className='text-lg font-bold'>{user.solvedCount}</span>
                    <span className='text-sm'>points</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default LeaderBoard
