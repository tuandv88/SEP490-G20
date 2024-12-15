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
function convertToRevenueGrowthData(apiData) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Kiểm tra nếu apiData và revenues là undefined hoặc null
  if (!apiData || !apiData.revenues) {
    return monthNames.map((month) => ({ month, revenue: 0 }))
  }

  try {
    // Lấy mảng revenues từ apiData
    const revenueData = apiData.revenues

    // Tạo object để mapping dữ liệu từ API
    const revenueByMonth = {}
    revenueData.forEach((item) => {
      if (item && typeof item.month === 'number' && item.totalRevenue != null) {
        revenueByMonth[item.month] = Number(item.totalRevenue.toFixed(2))
      }
    })

    // Tạo mảng đầy đủ 12 tháng
    return monthNames.map((month, index) => ({
      month: month,
      revenue: revenueByMonth[index + 1] || 0
    }))
  } catch (error) {
    return monthNames.map((month) => ({ month, revenue: 0 }))
  }
}

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

  const {
    newLearners,
    problemSubmissions,
    courseEnrollmentData,
    popularCourses,
    topSolvedProblems,
    monthlyRevenueWithGrowth,
    monthlyCourseSalesWithGrowth,
    totalRevenueByMonth
  } = data
  const popularCourData = popularCourses.courses.data
  const topSolvedProblemData = topSolvedProblems.problems.data
  const topEnrolledCourses = convertCoursesToArray(popularCourses)
  const revenueGrowthData = convertToRevenueGrowthData(totalRevenueByMonth)

  return (
    <ErrorBoundary>
      <PageContainer breadcrumbs={breadcrumbs}>
        <DashboardLayout>
          {/* Overview section */}
          <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4'>
            <OverviewCard
              title='Total Revenue'
              value={monthlyRevenueWithGrowth.totalRevenue}
              change={`${monthlyRevenueWithGrowth.growthRate.toFixed(2)}% from last month`}
              icon={DollarSign}
            />
            <OverviewCard
              title='New Users'
              value={newLearners.currentMonthCount}
              change={`${newLearners.percentageChange.toFixed(2)}% from last month`}
              icon={Users}
            />
            <OverviewCard
              title='Courses Sold'
              value={monthlyCourseSalesWithGrowth.currentMonthSales}
              change={`${monthlyCourseSalesWithGrowth.growthRate.toFixed(2)}% from last month`}
              icon={BookOpen}
            />
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
