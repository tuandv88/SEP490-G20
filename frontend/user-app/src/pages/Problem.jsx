import { useState } from 'react'
import FilterBar from '../components/problem/FilterBar'
import ProblemTable from '../components/problem/ProblemTable'
import Layout from '@/layouts/layout'
import ProblemPanelBot from '../components/problem/ProblemPanelBot'
import ProblemPanelTop from '../components/problem/ProblemPanelTop'
import { useEffect } from 'react'
import { ProblemAPI } from '@/services/api/problemApi'
import { Loading } from '@/components/ui/overlay'
import { ProblemSkeleton } from '@/components/loading/ProblemSkeleton'


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

  const [filters, setFilters] = useState({
    lists: '',
    difficulty: '',
    status: '',
    tags: new Set(),
    favorite: false
  })

  const pageSize = 6
  const [difficultyFilter, setDifficultyFilter] = useState('')

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
        const response = await ProblemAPI.getAllProblems(
          currentPage, 
          pageSize, 
          searchString,
          filters.difficulty
        )
        const { data, count } = response.problems
        setProblems(data)
        setTotalPages(Math.ceil(count / pageSize))
      } catch (error) {
        console.error('Error fetching problems:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [currentPage, searchQuery, filters.difficulty])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

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
