import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/services/api/courseApi'

export default function useCourseQueries(pageIndex, pageSize) {
  return useQuery({
    queryKey: ['courses', pageIndex, pageSize],
    queryFn: () => getCourses(pageIndex, pageSize),
    keepPreviousData: true
  })
}
