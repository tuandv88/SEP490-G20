import { DollarSign, Users, BookOpen, Trophy, Code } from 'lucide-react'
import DashboardLayout from '@/components/Dashboard/components-dashboard-layout'
import OverviewCard from '@/components/Dashboard/components-overview-card'
import StatisticsChart from '@/components/Dashboard/components-statistics-chart'
import PopularCoursesList from '@/components/Dashboard/components-popular-courses-list'
import UpcomingContestsList from '@/components/Dashboard/components-upcoming-contests-list'
import AlgorithmStatsList from '@/components/Dashboard/components-algorithm-stats-list'
import { PageContainer } from '@/components/page-container'


// Existing data (unchanged)

const popularCourses = [
  { id: 1, name: 'Advanced Algorithms', enrollments: 520, revenue: 26000 },
  { id: 2, name: 'Web Development with React', enrollments: 480, revenue: 24000 },
  { id: 3, name: 'Basic Machine Learning', enrollments: 450, revenue: 22500 },
  { id: 4, name: 'Data Structures and Algorithms', enrollments: 400, revenue: 20000 }
]

const upcomingContests = [
  { id: 1, name: 'National Programming Contest', date: '2024-08-15', participants: 500 },
  { id: 2, name: 'AI Hackathon', date: '2024-09-01', participants: 300 },
  { id: 3, name: 'Code Challenge: Algorithms', date: '2024-09-20', participants: 400 }
]

const algorithmStats = [
  { name: 'Sorting', submissions: 1200, avgScore: 85 },
  { name: 'Searching', submissions: 980, avgScore: 78 },
  { name: 'Graphs', submissions: 850, avgScore: 72 },
  { name: 'Dynamic Programming', submissions: 720, avgScore: 68 },
  { name: 'Data Structures', submissions: 650, avgScore: 70 }
]

const courseEnrollmentData = [
  { month: 'Jan', 'Web Development': 120, 'Data Science': 80, 'Mobile App': 60 },
  { month: 'Feb', 'Web Development': 150, 'Data Science': 100, 'Mobile App': 80 },
  { month: 'Mar', 'Web Development': 180, 'Data Science': 120, 'Mobile App': 90 },
  { month: 'Apr', 'Web Development': 200, 'Data Science': 150, 'Mobile App': 110 },
  { month: 'May', 'Web Development': 250, 'Data Science': 180, 'Mobile App': 140 },
  { month: 'Jun', 'Web Development': 280, 'Data Science': 220, 'Mobile App': 160 }
]

const userDistributionData = [
  { name: 'Web Development', value: 4500 },
  { name: 'Data Science', value: 2500 },
  { name: 'Mobile App Development', value: 2000 },
  { name: 'Machine Learning', value: 1500 },
  { name: 'DevOps', value: 1000 }
]

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

const topEnrolledCourses = [
  { name: 'Advanced Algorithms', enrollments: 520 },
  { name: 'Web Development with React', enrollments: 480 },
  { name: 'Basic Machine Learning', enrollments: 450 },
  { name: 'Data Structures and Algorithms', enrollments: 400 },
  { name: 'Python for Data Science', enrollments: 380 }
]

const breadcrumbs = [{ label: 'Dashboard', href: '/' }]

export default function AdminDashboard() {
  

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <DashboardLayout>
        {/* Overview section */}
        <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5'>
          <OverviewCard title='Total Revenue' value='47,000,000 $' change='+20.1% from last month' icon={DollarSign} />
          <OverviewCard title='New Users' value='+2,350' change='+10.1% from last month' icon={Users} />
          <OverviewCard title='Courses Sold' value='1,230' change='+12.5% from last month' icon={BookOpen} />
          <OverviewCard title='Contests Held' value='15' change='+3 from last month' icon={Trophy} />
          <OverviewCard title='Algorithm Submissions' value='4,400' change='+15.3% from last month' icon={Code} />
        </div>

        {/* Comprehensive Statistics section */}
        <StatisticsChart
          courseEnrollmentData={courseEnrollmentData}
          userDistributionData={userDistributionData}
          revenueGrowthData={revenueGrowthData}
          topEnrolledCourses={topEnrolledCourses}
        />

        {/* Popular Courses, Upcoming Contests, and Algorithm Statistics section */}
        <div className='grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3'>
          <PopularCoursesList courses={popularCourses} />
          <UpcomingContestsList contests={upcomingContests} />
          <AlgorithmStatsList stats={algorithmStats} />
        </div>
      </DashboardLayout>
    </PageContainer>
  )
}
