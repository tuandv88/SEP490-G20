import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/services/api/dashboardApi'

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: () => dashboardApi.getDashboardData().then((res) => res.data),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export const usePopularCourses = () => {
  return useQuery({
    queryKey: ['popularCourses'],
    queryFn: () => dashboardApi.getPopularCourses().then((res) => res.data),
    staleTime: 10 * 60 * 1000 // 10 minutes
  })
}

export const useUpcomingContests = () => {
  return useQuery({
    queryKey: ['upcomingContests'],
    queryFn: () => dashboardApi.getUpcomingContests().then((res) => res.data),
    staleTime: 15 * 60 * 1000 // 15 minutes
  })
}

export const useAlgorithmStats = () => {
  return useQuery({
    queryKey: ['algorithmStats'],
    queryFn: () => dashboardApi.getAlgorithmStats().then((res) => res.data),
    staleTime: 30 * 60 * 1000 // 30 minutes
  })
}
