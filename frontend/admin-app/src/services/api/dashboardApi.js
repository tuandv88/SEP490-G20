import axiosInstance from '@/lib/axios'

const dashboardApi = {
  getDashboardData: () => axiosInstance.get('/dashboard'),
  getPopularCourses: () => axiosInstance.get('/popular-courses'),
  getUpcomingContests: () => axiosInstance.get('/upcoming-contests'),
  getAlgorithmStats: () => axiosInstance.get('/algorithm-stats')
}

export default dashboardApi
