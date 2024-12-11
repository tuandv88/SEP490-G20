import { useMemo } from 'react'
import { DollarSign, Users, BookOpen, Code } from 'lucide-react'
import DashboardLayout from '@/components/Dashboard/components-dashboard-layout'
import OverviewCard from '@/components/Dashboard/components-overview-card'
import StatisticsChart from '@/components/Dashboard/components-statistics-chart'
import PopularCoursesList from '@/components/Dashboard/components-popular-courses-list'
import AlgorithmStatsList from '@/components/Dashboard/components-algorithm-stats-list'
import { PageContainer } from '@/components/page-container'
import { getPastAndCurrentDates } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from '@/services/api/dashboardApi'
import DashboardSkeleton from './DashboardSkeleton'
import ErrorBoundary from '@/components/error-boundary'

function convertCoursesToArray(coursesObject) {
  return coursesObject.courses.data.map((course) => ({
    name: course.title,
    enrollments: course.enrollmentCount
  }))
}
const revenueGrowthData = [
  { month: 'Jan', revenue: 50000 },
  { month: 'Feb', revenue: 60000 },
  { month: 'Mar', revenue: 75000 },
  { month: 'Apr', revenue: 90000 },
  { month: 'May', revenue: 110000 },
  { month: 'Jun', revenue: 130000 },
  { month: 'Jul', revenue: 130000 },
  { month: 'Aug', revenue: 140000 },
  { month: 'Sep', revenue: 150000 },
  { month: 'Oct', revenue: 160000 },
  { month: 'Nov', revenue: 170000 },
  { month: 'Dec', revenue: 100000 }
]

export default function AdminDashboard() {
  const breadcrumbs = [{ label: 'Dashboard', href: '/' }]
  const dates = useMemo(() => getPastAndCurrentDates(), []) // Memoize dates để tránh thay đổi không mong muốn.

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', dates],
    queryFn: () => fetchDashboardData(dates),
    staleTime: 60 * 1000 // Dữ liệu hợp lệ trong 1 phút.
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const { newLearners, problemSubmissions, courseEnrollmentData, popularCourses, topSolvedProblems } = data
  const popularCourData = popularCourses.courses.data
  const topSolvedProblemData = topSolvedProblems.problems.data
  const topEnrolledCourses = convertCoursesToArray(popularCourses)

  return (
    <ErrorBoundary>
      <PageContainer breadcrumbs={breadcrumbs}>
        <DashboardLayout>
          {/* Overview section */}
          <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4'>
            <OverviewCard title='Total Revenue' value='25 $' change='+100% from last month' icon={DollarSign} />
            <OverviewCard
              title='New Users'
              value={newLearners.currentMonthCount}
              change={`${newLearners.percentageChange.toFixed(2)}% from last month`}
              icon={Users}
            />
            <OverviewCard title='Courses Sold' value='10' change='+100% from last month' icon={BookOpen} />
            <OverviewCard
              title='Algorithm Submissions'
              value={problemSubmissions.currentMonthCount}
              change={`${problemSubmissions.percentageChange.toFixed(2)}% from last month`}
              icon={Code}
            />
          </div>

          {/* Comprehensive Statistics section */}
          <StatisticsChart
            courseEnrollmentData={courseEnrollmentData}
            topEnrolledCourses={topEnrolledCourses}
            revenueGrowthData={revenueGrowthData}
          />

          {/* Popular Courses and Algorithm Statistics section */}
          <div className='grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2'>
            <PopularCoursesList courses={popularCourData} />
            <AlgorithmStatsList stats={topSolvedProblemData} />
          </div>
        </DashboardLayout>
      </PageContainer>
    </ErrorBoundary>
  )
}
