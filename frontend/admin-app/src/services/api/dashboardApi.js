import {
  getMonthlyNewLearnersComparison,
  getMonthlyProblemSubmissionsComparison,
  getMostPopularCoursesWithEnrollments,
  getMonthlyEnrollmentsPerCourse,
  getTopSolvedProblems,
  GetMonthlyRevenueWithGrowth,
  GetMonthlyCourseSalesWithGrowth
} from '@/services/api/statisticApi'

export async function fetchDashboardData(dates) {
  const [
    newLearners,
    problemSubmissions,
    courseEnrollmentDataApi,
    popularCoursesData,
    topSolvedProblems,
    monthlyRevenueWithGrowth,
    monthlyCourseSalesWithGrowth
  ] = await Promise.all([
    getMonthlyNewLearnersComparison(),
    getMonthlyProblemSubmissionsComparison(),
    getMonthlyEnrollmentsPerCourse(dates.pastDate, dates.currentDate, 4),
    getMostPopularCoursesWithEnrollments(1, 4),
    getTopSolvedProblems(1, 4),
    GetMonthlyRevenueWithGrowth(),
    GetMonthlyCourseSalesWithGrowth()
  ])

  return {
    newLearners,
    problemSubmissions,
    courseEnrollmentData: convertEnrollmentData(courseEnrollmentDataApi),
    popularCourses: popularCoursesData,
    topSolvedProblems,
    monthlyRevenueWithGrowth,
    monthlyCourseSalesWithGrowth
  }
}

function convertEnrollmentData(apiData) {
  if (!apiData || !Array.isArray(apiData.monthlyCourseEnrollments)) {
    return []
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return apiData.monthlyCourseEnrollments.map((enrollment) => {
    const month = monthNames[enrollment.month - 1]
    const courses = enrollment.courses.reduce((acc, course) => {
      acc[course.title] = course.enrollmentCount
      return acc
    }, {})

    return { month, ...courses }
  })
}
