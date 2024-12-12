import { DiscussionTable } from '@/components/Discussion/DiscussionTable'
import { getAllDiscussions } from '@/services/api/discussionApi'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/page-container'
import { DISCUSSION_TABLE_PATH } from '@/routers/router'
import { Loader2 } from 'lucide-react' // This is a mock function to simulate fetching data from an API

export default function DiscussionsPage() {
  const breadcrumbs = [{ label: 'Discussions', href: DISCUSSION_TABLE_PATH }]
  const {
    data: discussions,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['discussions'],
    queryFn: getAllDiscussions
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Error: {error.message}</p>
      </div>
    )
  }
  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Discussions</h1>
        {discussions && <DiscussionTable data={discussions} refetchData={refetch} />}
      </div>
    </PageContainer>
  )
}
