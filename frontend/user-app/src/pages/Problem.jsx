import { useState } from 'react'
import FilterBar from '../components/problem/FilterBar'
import ActiveFilters from '../components/problem/ActiveFilters'
import ProblemTable from '../components/problem/ProblemTable'
import Layout from '@/layouts/layout'
import ProblemPanelBot from '../components/problem/ProblemPanelBot'
import ProblemPanelTop from '../components/problem/ProblemPanelTop'
import { useEffect } from 'react'
import { ProblemAPI } from '@/services/api/problemApi'
import { Loading } from '@/components/ui/overlay'
import { ProblemSkeleton } from '@/components/loading/ProblemSkeleton'

// const problems = [
//   {
//     id: 999,
//     title: '1. Largest Combination With Bitwise AND',
//     acceptance: '78.2%',
//     difficulty: 'Medium',
//     frequency: '',
//     solved: true,
//     tags: ['Array', 'String']
//   },
//   { id: 1, title: 'Two Sum', acceptance: '54.1%', difficulty: 'Easy', frequency: '', solved: true, tags: ['Array'] },
//   {
//     id: 2,
//     title: '2. Add Two Numbers',
//     acceptance: '44.5%',
//     difficulty: 'Medium',
//     frequency: '',
//     solved: false,
//     tags: ['String']
//   },
//   {
//     id: 3,
//     title: '3. Longest Substring Without Repeating Characters',
//     acceptance: '35.7%',
//     difficulty: 'Medium',
//     frequency: '',
//     solved: false,
//     tags: ['String']
//   },
//   {
//     id: 4,
//     title: '4. Median of Two Sorted Arrays',
//     acceptance: '41.9%',
//     difficulty: 'Hard',
//     frequency: '',
//     solved: false,
//     tags: ['Array']
//   },
//   {
//     id: 5,
//     title: '5. Longest Palindromic Substring',
//     acceptance: '34.7%',
//     difficulty: 'Medium',
//     frequency: '',
//     solved: false,
//     tags: ['String']
//   },
//   {
//     id: 6,
//     title: '6. Zigzag Conversion',
//     acceptance: '49.7%',
//     difficulty: 'Medium',
//     frequency: '',
//     solved: false,
//     tags: ['String']
//   },
//   {
//     id: 7,
//     title: '7. Reverse Integer',
//     acceptance: '29.4%',
//     difficulty: 'Medium',
//     frequency: '',
//     solved: false,
//     tags: ['Array']
//   }
// ]

const availableTags = ['Array', 'String', 'Dynamic Programming', 'Math', 'Tree']

const ITEMS_PER_PAGE = 5

function Problem() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [problems, setProblems] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [problemSolved, setProblemSolved] = useState([])
  const [leaderboardData, setLeaderboardData] = useState([])

  const pageSize = 6

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Thực hiện hai API call song song
        const [solvedResponse, leaderboardResponse] = await Promise.all([
          ProblemAPI.getProblemSolved(),
          ProblemAPI.getLeaderboard(1, 6),
        ])
  
        // Cập nhật state với dữ liệu nhận được
        setProblemSolved(solvedResponse)
        setLeaderboardData(leaderboardResponse)
  
        console.log('Solved Problems:', solvedResponse)
        console.log('Leaderboard Data:', leaderboardResponse)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  
    fetchData()
  }, [])

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true)
      try {
        const response = await ProblemAPI.getAllProblems(currentPage, pageSize, searchString)
        const { data, count } = response.problems
        setProblems(data)
        console.log('Problems:', data)
        setTotalPages(Math.ceil(count / pageSize))
      } catch (error) {
        console.error('Error fetching problems:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [currentPage, searchQuery])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const [filters, setFilters] = useState({
    lists: '',
    difficulty: '',
    status: '',
    tags: new Set(),
    favorite: false
  })

  const stats = {
    easy: 1,
    medium: 0,
    hard: 0,
    totalEasy: 832,
    totalMedium: 1750,
    totalHard: 761
  }

  const handleRemoveFilter = (type, value) => {
    setFilters((prev) => {
      if (type === 'tags' && value) {
        const newTags = new Set(prev.tags)
        newTags.delete(value)
        return { ...prev, tags: newTags }
      }
      return { ...prev, [type]: '' }
    })
  }

  const handleReset = () => {
    setFilters({
      lists: '',
      difficulty: '',
      status: '',
      tags: new Set(),
      favorite: false
    })
    setSearchString('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setSearchQuery(searchString) // Cập nhật searchQuery khi nhấn nút Search
  }

  const handleTagToggle = (tag) => {
    setFilters((prev) => {
      const newTags = new Set(prev.tags)
      if (newTags.has(tag)) {
        newTags.delete(tag)
      } else {
        newTags.add(tag)
      }
      return { ...prev, tags: newTags }
    })
  }

  return (
    <Layout>
      <div className='min-h-screen bg-background text-foreground p-6 mt-[100px]'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex gap-6'>
            <div className='flex-1'>
              {loading ? (
                <ProblemSkeleton />
              ) : (
                <ProblemTable
                  problems={problems}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
            <div className='w-80 space-y-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <FilterBar
                  filters={filters}
                  setFilters={setFilters}
                  availableTags={availableTags}
                  handleTagToggle={handleTagToggle}
                  handleReset={handleReset}
                  setSearchString={setSearchString}
                  handleSearch={handleSearch}
                  searchString={searchString}
                />
                <ActiveFilters filters={filters} handleRemoveFilter={handleRemoveFilter} handleReset={handleReset} />
              </div>
              <ProblemPanelBot problemSolved={problemSolved} leaderboardData={leaderboardData} />
              <ProblemPanelTop leaderboardData={leaderboardData} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Problem
